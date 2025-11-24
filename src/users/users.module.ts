import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRepository } from '../infrastructure/mikroorm/repositories/user.repository';
import { IUserRepository } from './user.types';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { LoggerModule } from '../loggers/logger.module';

@Module({
  imports: [AuthModule, CommonModule, LoggerModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  exports: [UsersService, IUserRepository],
})
export class UsersModule {}
