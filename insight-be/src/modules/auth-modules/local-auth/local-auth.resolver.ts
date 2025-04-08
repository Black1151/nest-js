// src/local-auth/local-auth.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from 'src/modules/auth-modules/auth/auth.service';
import { GqlLocalAuthGuard } from 'src/guards/gql-local-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/modules/user/user.model';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { AuthTokens } from 'src/modules/auth-modules/auth/dto/res/auth-tokens.dto';
import { LoginRequest } from 'src/modules/auth-modules/auth/dto/req/login-request.dto';
import { PublicRoute } from 'src/decorators/public.decorator';
import { UsersService } from 'src/modules/user/user.service';

@Resolver()
export class LocalAuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Register a new user, hashing the password before storing.
   */
  @Mutation(() => User)
  @PublicRoute()
  async registerNewUserLocally(
    @Args('data') data: CreateUserDto,
  ): Promise<User> {
    return this.usersService.create(data);
  }

  /**
   * Login with email + password => returns access + refresh tokens
   */
  @Mutation(() => AuthTokens)
  @UseGuards(GqlLocalAuthGuard)
  @PublicRoute()
  async logUserInWithEmailAndPassword(
    @Args('data') _loginData: LoginRequest,
    @CurrentUser() user: User,
  ): Promise<AuthTokens> {
    return this.authService.login(user);
  }
}
