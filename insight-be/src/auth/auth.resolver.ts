// auth.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UseGuards } from '@nestjs/common';
import { GqlLocalAuthGuard } from 'src/guards/gql-local-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/user/user.model';
import { AuthTokens } from './dto/res/auth-tokens.dto';
import { LoginRequest } from './dto/req/login-request.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async register(@Args('data') data: CreateUserDto): Promise<User> {
    return this.authService.register(data);
  }

  /**
   * Login with email + password => returns access + refresh tokens
   */
  @UseGuards(GqlLocalAuthGuard)
  @Mutation(() => AuthTokens)
  async login(
    @Args('data') loginData: LoginRequest,
    @CurrentUser() user: User,
  ): Promise<AuthTokens> {
    return this.authService.login(user);
  }

  /**
   * Refresh a new access + refresh token pair
   */
  @Mutation(() => AuthTokens)
  async refresh(@Args('refreshToken') refreshToken: string): Promise<AuthTokens> {
    return this.authService.refreshToken(refreshToken);
  }
}
