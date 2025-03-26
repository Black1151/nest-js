// src/middleware/request-logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';

const logger = pino({
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: { translateTime: true },
        }
      : undefined,
});

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const requestId = uuidv4();

    req.requestId = requestId;

    logger.info({
      event: 'incoming-request',
      requestId,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      //   operationName,
      //   querySummary,
    });

    next();
  }
}
