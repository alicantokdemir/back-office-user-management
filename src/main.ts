import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup, swaggerSetup } from './setup';

async function bootstrap() {
  // Buffering logs to make sure all logs will be buffered until a custom logger is attached
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const port = process.env.PORT ?? 3000;

  console.log(`Server is running on port ${port}`);

  appSetup(app);
  swaggerSetup(app);

  await app.listen(port);
}
bootstrap();
