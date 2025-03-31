import { RequestLoggerMiddleware } from './request-logger.middleware';
import { logger } from '../logger';

jest.mock('../logger', () => ({
  logger: {
    info: jest.fn(),
  },
}));

describe('RequestLoggerMiddleware', () => {
  let middleware: RequestLoggerMiddleware;
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    middleware = new RequestLoggerMiddleware();
    mockReq = { ip: '127.0.0.1', headers: { 'user-agent': 'JestTest' } };
    mockRes = {};
    mockNext = jest.fn();
    (logger.info as jest.Mock).mockClear();
  });

  it('should attach requestId and call logger.info', () => {
    middleware.use(mockReq, mockRes, mockNext);

    expect(mockReq.requestId).toBeDefined(); // a UUID
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'incoming-request',
        requestId: expect.any(String),
        ip: '127.0.0.1',
        userAgent: 'JestTest',
      }),
    );
    expect(mockNext).toHaveBeenCalled();
  });
});
