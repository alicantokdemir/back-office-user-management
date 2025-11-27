import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IAuthUserRepository } from './auth.types';
import { AuthUserRepository } from '../infrastructure/mikroorm/repositories/auth-user.repository';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JWT_ACCESS_TOKEN_EXPIRY, JWT_SECRET } from '../common/constants';
import { LoggerModule } from '../loggers/logger.module';
import { SessionsModule } from '../sessions/session.module';
import { CommonModule } from '../common/common.module';

@Global()
@Module({
  imports: [
    LoggerModule,
    UsersModule,
    SessionsModule,
    PassportModule,
    CommonModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_ACCESS_TOKEN_EXPIRY },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: IAuthUserRepository,
      useClass: AuthUserRepository,
    },

    JwtStrategy,
  ],
  exports: [AuthService, IAuthUserRepository],
})
export class AuthModule {}
