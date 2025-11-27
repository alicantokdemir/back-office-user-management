import { Global, Module } from '@nestjs/common';

import { AuthUserRepository } from '../infrastructure/mikroorm/repositories/auth-user.repository';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_ACCESS_TOKEN_EXPIRY, JWT_SECRET } from '../common/constants';
import { LoggerModule } from '../loggers/logger.module';
import { SessionsModule } from '../sessions/session.module';
import { CommonModule } from '../common/common.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [
    LoggerModule,
    UsersModule,
    SessionsModule,
    PassportModule,
    AuthModule,
    CommonModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
