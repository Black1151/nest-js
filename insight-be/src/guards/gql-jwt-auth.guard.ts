// src/guards/jwt-auth.guard.ts
import { AuthGuard } from '@nestjs/passport';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const token = request?.cookies?.accessToken;
    if (token) {
      request.headers.authorization = `Bearer ${token}`;
    }
    return request;
  }
}
