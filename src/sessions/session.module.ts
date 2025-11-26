import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { LoggerModule } from '../loggers/logger.module';
import { SessionRepository } from '../infrastructure/mikroorm/repositories/session.repository';
import { SessionsService } from './sessions.service';
import { ISessionRepository } from './session.types';

@Module({
  imports: [CommonModule, LoggerModule],
  controllers: [],
  providers: [
    SessionsService,
    {
      provide: ISessionRepository,
      useClass: SessionRepository,
    },
  ],
  exports: [SessionsService, ISessionRepository],
})
export class SessionsModule {}
