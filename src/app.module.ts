import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ThingsModule } from './things/things.module';
import { MetricsModule } from './metrics/metrics.module';
import { LoggerModule } from './loggers/logger.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UsersModule,
    ThingsModule,
    MetricsModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
