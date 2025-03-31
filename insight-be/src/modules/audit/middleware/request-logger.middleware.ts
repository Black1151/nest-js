import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../logger';

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
    });

    next();
  }
}
