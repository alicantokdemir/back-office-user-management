import { Controller, Get } from '@nestjs/common';
import { LoggerService } from './loggers/logger.service';
import { EntityManager } from '@mikro-orm/sqlite';

type HealthStatus = {
  status: string;
};

@Controller()
export class AppController {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly em: EntityManager,
  ) {
    this.loggerService.setContext(AppController.name);
  }

  @Get('health')
  health(): HealthStatus {
    this.loggerService.log('Health endpoint called');

    return { status: 'ok' };
  }

  @Get('ready')
  async ready(): Promise<HealthStatus> {
    this.loggerService.log('Ready endpoint called');
    try {
      await this.em.execute('SELECT 1');
      return { status: 'ok' };
    } catch (error) {
      this.loggerService.error('Database connection failed', error);
      return { status: 'error' };
    }
  }
}
