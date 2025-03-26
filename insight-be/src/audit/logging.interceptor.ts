import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';
import pino from 'pino';

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
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext().req;

    const info = gqlContext.getInfo();
    const operationName = info?.operation?.name?.value;

    const user = req?.user;
    const userId = user?.publicId || 'anonymous';

    return next.handle().pipe(
      tap(() => {
        const elapsedMs = Date.now() - startTime;
        logger.info({
          stage: 'request-completed',
          requestId: req.requestId,
          operationName,
          userId,
          roles: user?.roles,
          elapsedTimeMs: elapsedMs,
        });
      }),
    );
  }
}
