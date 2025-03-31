import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { logger } from '../logger';
import { AuditService } from '../services/audit.service';
import { BatchAuditService } from '../services/batch-audit.service';
import { IMMUTABLE_LOGGING_KEY } from '../decorators/immutable-logging.decorator';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AuditService,
    private readonly batchAuditService: BatchAuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    const gqlCtx = GqlExecutionContext.create(context);
    const req = gqlCtx.getContext().req;
    const info = gqlCtx.getInfo();

    const operationName = info?.operation?.name?.value || 'unknownOperation';
    const user = req?.user;
    const userId = user?.publicId || 'anonymous';
    const requestId = req.requestId;
    const roles = user?.roles || [];

    const handler = context.getHandler();
    const isCritical = this.reflector.getAllAndOverride<boolean>(
      IMMUTABLE_LOGGING_KEY,
      [handler, context.getClass()],
    );

    return next.handle().pipe(
      tap((result) => {
        const elapsedMs = Date.now() - startTime;

        const record = {
          event: isCritical ? 'critical-action-completed' : 'action-completed',
          operationName,
          requestId,
          userId,
          roles,
          elapsedMs,
          timestamp: new Date().toISOString(),
          result,
        };

        logger.info(record);

        if (isCritical) {
          this.auditService.appendCriticalAuditLog(record).catch((err) =>
            logger.error({
              err,
              msg: 'Failed to write critical log to immuDB',
            }),
          );
        } else {
          this.batchAuditService.addLogRecord(record);
        }
      }),
    );
  }
}
