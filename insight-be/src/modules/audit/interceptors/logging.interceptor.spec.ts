import { LoggingInterceptor } from './logging.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { logger } from '../logger';
import { AuditService } from '../services/audit.service';
import { BatchAuditService } from '../services/batch-audit.service';

jest.mock('../logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let reflector: Reflector;
  let mockAuditService: Partial<AuditService>;
  let mockBatchAuditService: Partial<BatchAuditService>;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockCallHandler: Partial<CallHandler>;

  beforeEach(() => {
    reflector = new Reflector();
    mockAuditService = {
      appendCriticalAuditLog: jest.fn().mockResolvedValue({}),
    };
    mockBatchAuditService = {
      addLogRecord: jest.fn(),
    };

    interceptor = new LoggingInterceptor(
      reflector as any,
      mockAuditService as AuditService,
      mockBatchAuditService as BatchAuditService,
    );

    mockExecutionContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };

    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of('mockResult')), // simulate next.handle()
    };

    (logger.info as jest.Mock).mockClear();
    (logger.error as jest.Mock).mockClear();
  });

  const createGqlContext = (isCritical: boolean, userId = 'testUser') => {
    // you can simulate metadata from the Reflector if needed:
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(isCritical);

    return {
      getContext: () => ({
        req: {
          user: { publicId: userId, roles: ['test-role'] },
          requestId: 'test-request-id',
        },
      }),
      getInfo: () => ({
        operation: { name: { value: 'testOperation' } },
      }),
    };
  };

  it('should log non-critical actions to logger.info and batch them', async () => {
    // Force the route to NOT be critical
    mockExecutionContext['switchToHttp'] = jest.fn();
    (mockExecutionContext as any)['getArgByIndex'] = jest
      .fn()
      .mockReturnValueOnce(null);

    const gqlCtx = createGqlContext(false);
    jest
      .spyOn(require('@nestjs/graphql'), 'GqlExecutionContext')
      .mockReturnValue(gqlCtx);

    const result = await interceptor
      .intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler as CallHandler,
      )
      .toPromise();

    expect(result).toBe('mockResult');

    // logger.info called
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'action-completed',
        userId: 'testUser',
        requestId: 'test-request-id',
        operationName: 'testOperation',
        roles: ['test-role'],
      }),
    );

    // Since it's non-critical, batchAuditService.addLogRecord is called
    expect(mockBatchAuditService.addLogRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'action-completed',
      }),
    );

    // appendCriticalAuditLog NOT called
    expect(mockAuditService.appendCriticalAuditLog).not.toHaveBeenCalled();
  });

  it('should log critical actions and immediately store them in immuDB', async () => {
    // Force the route to be critical
    const gqlCtx = createGqlContext(true);
    jest
      .spyOn(require('@nestjs/graphql'), 'GqlExecutionContext')
      .mockReturnValue(gqlCtx);

    const result = await interceptor
      .intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler as CallHandler,
      )
      .toPromise();

    expect(result).toBe('mockResult');

    // logger.info called with "critical-action-completed"
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'critical-action-completed',
        userId: 'testUser',
      }),
    );

    // immuDB call
    expect(mockAuditService.appendCriticalAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'critical-action-completed',
      }),
    );
    // batching not called
    expect(mockBatchAuditService.addLogRecord).not.toHaveBeenCalled();
  });
});
