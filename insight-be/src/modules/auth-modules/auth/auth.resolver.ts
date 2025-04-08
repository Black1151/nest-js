// src/auth/auth.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthTokens } from './dto/res/auth-tokens.dto';
import { PublicRoute } from 'src/decorators/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  /**
   * Refresh your tokens
   */
  @Mutation(() => AuthTokens)
  @PublicRoute()
  async refreshUsersTokens(
    @Args('refreshToken') refreshToken: string,
  ): Promise<AuthTokens> {
    return this.authService.refreshToken(refreshToken);
  }
}
