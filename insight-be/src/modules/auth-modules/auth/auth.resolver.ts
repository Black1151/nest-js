// src/auth/auth.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthTokens } from './dto/res/auth-tokens.dto';
import { PublicRoute } from 'src/decorators/public.decorator';
import { LoginResponse } from './dto/res/login-response.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  /**
   * Refresh your tokens
   */
  @Mutation(() => LoginResponse)
  @PublicRoute()
  async refreshUsersTokens(
    @Args('refreshToken') refreshToken: string,
  ): Promise<LoginResponse> {
    return this.authService.refreshToken(refreshToken);
  }
}
