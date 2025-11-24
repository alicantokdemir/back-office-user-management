import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

// Transient scope ensures a new instance is created for each injection
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  constructor() {
    super({
      json: true,
      prefix: '[MyApp]',
      logLevels:
        process.env.NODE_ENV === 'production'
          ? ['error', 'warn']
          : ['log', 'error', 'warn', 'debug', 'verbose'],
    });
  }
}
