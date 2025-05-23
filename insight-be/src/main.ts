import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RequestLoggerMiddleware } from './modules/audit/middleware/request-logger.middleware';
import { AllExceptionsFilter } from './modules/audit/filters/all-exception.filter';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['content-type', 'authorization'],
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
