import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AuditService } from './services/audit.service';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from 'src/modules/audit/filters/all-exception.filter';
import { BatchAuditService } from './services/batch-audit.service';

@Module({
  providers: [
    AuditService,
    BatchAuditService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  exports: [AuditService, BatchAuditService],
})
export class AuditModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
