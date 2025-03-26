// src/filters/all-exceptions.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import pino from 'pino';

// You could also inject a logger via constructor, but we'll just instantiate here:
const logger = pino({
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: { translateTime: true },
        }
      : undefined,
});

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (host.getType() === 'http') {
      const httpContext = host.switchToHttp();
      const req = httpContext.getRequest();
      const correlationId = req?.correlationId || 'unknown';

      logger.error({
        event: 'exception',
        correlationId,
        statusCode: exception?.getStatus?.() || 500,
        message: exception.message || 'Unexpected error',
        stack: exception.stack,
      });

      throw exception;
    } else {
      const gqlContext = GqlArgumentsHost.create(host);
      const { req } = gqlContext.getContext();
      const correlationId = req?.correlationId || 'unknown';

      logger.error({
        event: 'exception',
        correlationId,
        message: exception.message || 'Unexpected error',
        stack: exception.stack,
      });

      throw exception;
    }
  }
}
