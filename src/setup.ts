import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { LoggerService } from './loggers/logger.service';

export function appSetup(app: INestApplication) {
  app.useLogger(new LoggerService());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(cookieParser());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
  }
}

export function swaggerSetup(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Thing API')
    .setDescription('Thing API description')
    .setVersion('1.0')
    .addTag('Thing')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
      },
      'api-key-auth',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
}
