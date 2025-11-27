import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_SECRET } from '../common/constants';
import { AccessTokenPayload, ReqUser } from './auth.types';
import { SessionsService } from '../sessions/sessions.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    private readonly sessionService: SessionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: AccessTokenPayload): Promise<ReqUser> {
    const userId = payload.sub;
    const sessionId = payload.sid;

    const [isValidSession, isValidUser] = await Promise.all([
      this.sessionService.validateSession(sessionId),
      this.userService.validateUser(userId),
    ]);

    if (!isValidSession) {
      throw new UnauthorizedException('Invalid session');
    }

    if (!isValidUser) {
      throw new UnauthorizedException('Invalid user');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      sessionId: payload.sid,
    };
  }
}
