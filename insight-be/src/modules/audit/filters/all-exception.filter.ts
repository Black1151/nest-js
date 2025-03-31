import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { AuditService } from '../services/audit.service';
import { BatchAuditService } from '../services/batch-audit.service';
import { logger } from '../logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly auditService: AuditService,
    private readonly batchAuditService: BatchAuditService,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    // 1) GraphQL context
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext();
    const req = ctx.req;
    const user = req?.user || {};
    const userId = user?.publicId || 'unknown';
    const requestId = req?.requestId || 'unknown';

    const wasImmutableLogging = !!req.__immutableLogging;

    let event = 'exception';
    let isCriticalFailure = wasImmutableLogging; // Start from that

    // 4) You can still do additional logic, like if 403 => critical
    let errorResponse =
      exception instanceof HttpException ? exception.getResponse() : exception;

    if (errorResponse && typeof errorResponse === 'object') {
      const statusCode = (errorResponse as any).statusCode;
      if (statusCode === 403) {
        event = 'critical-failure';
        isCriticalFailure = true;
      }
    }

    if (isCriticalFailure) {
      event = 'critical-failure';
    }

    // 5) Build the record
    const record = {
      event,
      userId,
      requestId,
      timestamp: new Date().toISOString(),
      error: errorResponse,
    };

    // 6) Log to Elasticsearch
    logger.error(record);

    // 7) Log to immuDB
    if (isCriticalFailure) {
      // immediate
      await this.auditService.appendCriticalAuditLog(record);
    } else {
      // batched
      this.batchAuditService.addLogRecord(record);
    }

    // 8) Re-throw the exception so Nest can continue handling it
    throw exception;
  }
}
