import { ArgumentsHost, HttpException } from '@nestjs/common';
import { AuditService } from '../services/audit.service';
import { BatchAuditService } from '../services/batch-audit.service';
import { logger } from '../logger';
import { AllExceptionsFilter } from './all-exception.filter';

jest.mock('../logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockAuditService: Partial<AuditService>;
  let mockBatchAuditService: Partial<BatchAuditService>;
  let mockArgumentsHost: Partial<ArgumentsHost>;

  beforeEach(() => {
    mockAuditService = {
      appendCriticalAuditLog: jest.fn().mockResolvedValue({}),
    };
    mockBatchAuditService = {
      addLogRecord: jest.fn(),
    };
    filter = new AllExceptionsFilter(
      mockAuditService as AuditService,
      mockBatchAuditService as BatchAuditService,
    );

    mockArgumentsHost = {
      switchToHttp: jest.fn(),
    };
    (logger.error as jest.Mock).mockClear();
  });

  const createGqlHost = (reqProps: any) => {
    return {
      getContext: () => ({ req: reqProps }),
    };
  };

  it('should log non-critical exceptions and add them to batch', async () => {
    const req = {
      __immutableLogging: false,
      user: { publicId: 'testUser' },
      requestId: 'test-req-id',
    };
    const gqlHost = createGqlHost(req);
    // mock GqlArgumentsHost.create() usage
    const mockGql = jest.fn().mockReturnValue(gqlHost);
    jest.doMock('@nestjs/graphql', () => ({
      GqlArgumentsHost: { create: mockGql },
    }));

    const exception = new Error('Test Error');

    // Because we call throw again, we must catch it in test
    await expect(
      filter.catch(exception, mockArgumentsHost as ArgumentsHost),
    ).rejects.toThrowError('Test Error');

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'exception',
        userId: 'testUser',
        requestId: 'test-req-id',
      }),
    );
    expect(mockBatchAuditService.addLogRecord).toHaveBeenCalled();
    expect(mockAuditService.appendCriticalAuditLog).not.toHaveBeenCalled();
  });

  it('should log critical exceptions and store them in immuDB', async () => {
    const req = {
      __immutableLogging: true,
      user: { publicId: 'critUser' },
      requestId: 'crit-req-id',
    };
    const gqlHost = createGqlHost(req);
    const mockGql = jest.fn().mockReturnValue(gqlHost);
    jest.doMock('@nestjs/graphql', () => ({
      GqlArgumentsHost: { create: mockGql },
    }));

    const exception = new Error('Critical Error');

    await expect(
      filter.catch(exception, mockArgumentsHost as ArgumentsHost),
    ).rejects.toThrowError('Critical Error');

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'critical-failure',
        userId: 'critUser',
        requestId: 'crit-req-id',
      }),
    );
    expect(mockAuditService.appendCriticalAuditLog).toHaveBeenCalled();
    expect(mockBatchAuditService.addLogRecord).not.toHaveBeenCalled();
  });

  it('treats 403 as critical', async () => {
    const req = {
      __immutableLogging: false,
      user: { publicId: 'anyUser' },
      requestId: 'any-req',
    };
    const gqlHost = createGqlHost(req);
    const mockGql = jest.fn().mockReturnValue(gqlHost);
    jest.doMock('@nestjs/graphql', () => ({
      GqlArgumentsHost: { create: mockGql },
    }));

    const exception = new HttpException('Forbidden', 403);

    await expect(
      filter.catch(exception, mockArgumentsHost as ArgumentsHost),
    ).rejects.toThrowError('Forbidden');

    // Logged as critical-failure
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'critical-failure',
      }),
    );
    // appended to immuDB
    expect(mockAuditService.appendCriticalAuditLog).toHaveBeenCalled();
  });
});
