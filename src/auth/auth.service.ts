import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoggerService } from '../loggers/logger.service';
import { LoginDto } from './dto/login.dto';
import {
  IAuthUserRepository,
  AccessTokenPayload,
  RefreshTokenPayload,
} from './auth.types';
import { UsersService } from '../users/users.service';
import { verify, hash } from '@node-rs/argon2';
import { JwtService } from '@nestjs/jwt';
import {
  JWT_REFRESH_TOKEN_EXPIRY,
  JWT_ACCESS_TOKEN_EXPIRY,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  HASHING_OPTIONS,
} from '../common/constants';
import { LoginResponseDto } from './dto/login.response.dto';
import { UserStatus } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { AuthUser } from './entities/auth-user.entity';
import { v4 } from 'uuid';
import { ISessionRepository } from '../sessions/session.types';
import { Session } from '../sessions/entities/session.entity';
import { ITransactionManager } from '../common/transaction-manager';
import { IUserRepository } from '../users/user.types';
import { SessionsService } from '../sessions/sessions.service';
import { hashSecret } from '../common/helper';

@Injectable()
export class AuthService {
  constructor(
    @Inject(IAuthUserRepository)
    private readonly authUserRepository: IAuthUserRepository,
    @Inject(ISessionRepository)
    private readonly sessionRepository: ISessionRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly logger: LoggerService,
    private readonly jwtService: JwtService,
    @Inject(ITransactionManager)
    private readonly transactionManager: ITransactionManager,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async login(
    loginDto: LoginDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<LoginResponseDto> {
    const email = loginDto.email?.toLowerCase?.() ?? '';

    this.logger.log(`Login attempt for ${email}`);

    const validAuthUser = await this.validateUserByEmailAndPassword(
      email,
      loginDto.password,
    );

    if (!validAuthUser) {
      this.logger.warn(`Login failed - invalid credentials for ${email}`);
      // small random delay to mitigate brute force timing
      await new Promise((r) => setTimeout(r, Math.random() * 800 + 200));

      throw new UnauthorizedException('Invalid credentials');
    }

    const validUser = await this.usersService.validateUser(
      validAuthUser.userId,
    );

    if (!validUser) {
      this.logger.warn(
        `Login failed - user inactive or not found for ${email}`,
      );

      throw new UnauthorizedException('Invalid credentials');
    }

    const newSessionId = v4();

    const { accessToken, refreshToken } = this.signTokens(
      this.generateAccessTokenPayload(
        validAuthUser.userId,
        validAuthUser.email,
        newSessionId,
      ),
      this.generateRefreshTokenPayload(
        validAuthUser.userId,
        validAuthUser.email,
        newSessionId,
      ),
    );

    const decodedToken = this.jwtService.decode(refreshToken) as {
      exp: number;
    };

    const expiresAt = new Date(decodedToken.exp * 1000);

    const refreshTokenHash = await hashSecret(refreshToken);

    const newSession = new Session({
      id: newSessionId,
      userId: validAuthUser.userId,
      refreshTokenHash,
      expiresAt,
      ipAddress,
      userAgent,
    });

    await this.transactionManager.saveInTransaction(
      async (repos) => {
        await Promise.all([
          repos[0].create(newSession),
          repos[1].update(validUser.id, {
            loginCount: validUser.loginCount + 1,
          }),
        ]);
      },
      [this.sessionRepository, this.userRepository],
    );

    const response: LoginResponseDto = {
      accessToken,
      refreshToken,
      session: {
        id: newSession.id,
        expiresAt: newSession.expiresAt,
      },
    };

    return response;
  }

  async register(registerDto: RegisterDto): Promise<boolean> {
    const email = registerDto.email?.toLowerCase?.() ?? '';

    this.logger.log(`Register attempt for ${email}`);

    const existing = await this.authUserRepository.findOne({ email });
    if (existing) {
      this.logger.warn(`Registration failed - email already in use: ${email}`);

      throw new ConflictException('Email already in use');
    }

    const passwordHash = await hashSecret(registerDto.password);

    const user = await this.usersService.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      status: registerDto.status || UserStatus.ACTIVE,
    });

    try {
      await this.authUserRepository.create(
        new AuthUser({
          userId: user.id,
          email,
          passwordHash,
        }),
      );

      this.logger.log(`Registered new user (id=${user.id})`);
    } catch (err) {
      this.logger.error('Failed to create auth user', err);
      // rollback user
      try {
        await this.usersService.remove(user.id);
      } catch (e) {
        this.logger.error(
          'Failed deleting user after auth user creation failure',
          e,
        );
      }

      throw new InternalServerErrorException('Registration failed');
    }

    return true;
  }

  async refreshAuth(refreshToken: string) {
    this.logger.log('Refreshing tokens');

    let payload: RefreshTokenPayload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: JWT_REFRESH_SECRET,
      });
    } catch (err) {
      this.logger.warn('Invalid refresh token');

      throw new UnauthorizedException('Invalid refresh token');
    }

    const userId = payload?.sub;
    if (!userId) {
      this.logger.warn('Refresh token missing userId');

      throw new UnauthorizedException('Invalid refresh token');
    }

    const sessionId = payload?.sid;
    if (!sessionId) {
      this.logger.warn('Refresh token missing sessionId');

      throw new UnauthorizedException('Invalid refresh token');
    }

    const validSession = await this.sessionsService.validateSession(sessionId);

    if (!validSession) {
      this.logger.warn('Invalid or expired session for refresh token');

      throw new UnauthorizedException('Invalid refresh token');
    }

    const matches = await verify(
      validSession.refreshTokenHash,
      refreshToken,
      HASHING_OPTIONS,
    );

    if (!matches) {
      this.logger.warn(
        'Refresh token does not match stored hash — possible token theft',
      );
      // Remove session as defensive measure
      await this.sessionsService.removeSession(sessionId, userId);

      throw new UnauthorizedException('Invalid refresh token');
    }

    const { accessToken: newAccessToken } = this.signTokens(
      this.generateAccessTokenPayload(userId, payload.email, sessionId),
      null,
    );

    this.logger.log(`Rotated access token for session id=${sessionId}`);

    return {
      accessToken: newAccessToken,
    };
  }

  async logout(sessionId: string, userId: string) {
    this.logger.log(`Logout requested for session ${sessionId}`);

    const session = await this.sessionRepository.findOne({
      id: sessionId,
      userId,
    });

    if (!session) {
      this.logger.warn(`Logout: session not found id=${sessionId}`);

      throw new BadRequestException('Session not found');
    }

    await this.sessionRepository.remove(session.id);

    this.logger.log(`Session ${sessionId} deleted`);
  }

  async validateUserByEmailAndPassword(email: string, plainPassword: string) {
    try {
      const authUser = await this.authUserRepository.findOne({
        email: email.toLowerCase(),
      });

      if (!authUser) return null;

      const ok = await verify(
        authUser.passwordHash,
        plainPassword,
        HASHING_OPTIONS,
      );

      if (!ok) return null;

      return authUser;
    } catch (error) {
      this.logger.error(`Error validating user by email ${email}: ${error}`);

      throw new InternalServerErrorException('Error validating user');
    }
  }

  private generateAccessTokenPayload(
    userId: string,
    email: string,
    sessionId: string,
  ): AccessTokenPayload {
    return {
      sub: userId,
      email,
      sid: sessionId,
    };
  }

  private generateRefreshTokenPayload(
    userId: string,
    email: string,
    sessionId: string,
  ): RefreshTokenPayload {
    return {
      sub: userId,
      email,
      sid: sessionId,
    };
  }

  private signTokens(
    accessTokenPayload: AccessTokenPayload,
    refreshTokenPayload: RefreshTokenPayload,
  ): { accessToken: string; refreshToken: string } {
    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: JWT_SECRET,
      expiresIn: JWT_ACCESS_TOKEN_EXPIRY,
    });

    if (!refreshTokenPayload) {
      return { accessToken, refreshToken: null };
    }

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: JWT_REFRESH_SECRET,
      expiresIn: JWT_REFRESH_TOKEN_EXPIRY,
    });

    return { accessToken, refreshToken };
  }
}
