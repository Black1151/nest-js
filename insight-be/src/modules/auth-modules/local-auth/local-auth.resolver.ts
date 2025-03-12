// src/local-auth/local-auth.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from 'src/modules/auth-modules/auth/auth.service';
import { GqlLocalAuthGuard } from 'src/guards/gql-local-auth.guard'; // same guard you had for local strategy
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/user/user.model';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthTokens } from 'src/modules/auth-modules/auth/dto/res/auth-tokens.dto';
import { LoginRequest } from 'src/modules/auth-modules/auth/dto/req/login-request.dto';

@Resolver()
export class LocalAuthResolver {
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
    @Args('data') _loginData: LoginRequest,
    @CurrentUser() user: User,
  ): Promise<AuthTokens> {
    return this.authService.login(user);
  }
}
