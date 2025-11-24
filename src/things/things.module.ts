import { Module } from '@nestjs/common';
import { IThingRepository } from './things.types';
import { ThingRepository } from '../infrastructure/mikroorm/repositories/thing.repository';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { ThingsController } from './things.controller';
import { ThingsService } from './things.service';
import { LoggerModule } from '../loggers/logger.module';

@Module({
  imports: [AuthModule, CommonModule, LoggerModule],
  controllers: [ThingsController],
  providers: [
    ThingsService,
    {
      provide: IThingRepository,
      useClass: ThingRepository,
    },
  ],
  exports: [ThingsService, IThingRepository],
})
export class ThingsModule {}
