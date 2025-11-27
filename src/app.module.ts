import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { MetricsModule } from './metrics/metrics.module';
import { LoggerModule } from './loggers/logger.module';
import { SessionsModule } from './sessions/session.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UsersModule,
    SessionsModule,
    MetricsModule,
    LoggerModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
