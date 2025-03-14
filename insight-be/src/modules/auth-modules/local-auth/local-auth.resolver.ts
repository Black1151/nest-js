// src/local-auth/local-auth.resolver.ts
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from 'src/modules/auth-modules/auth/auth.service';
import { GqlLocalAuthGuard } from 'src/guards/gql-local-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/user/user.model';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthTokens } from 'src/modules/auth-modules/auth/dto/res/auth-tokens.dto';
import { LoginRequest } from 'src/modules/auth-modules/auth/dto/req/login-request.dto';
import { Response } from 'express';

@Resolver()
export class LocalAuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async register(@Args('data') data: CreateUserDto): Promise<User> {
    return this.authService.register(data);
  }

  /**
   * Login with email + password => returns access + refresh tokens,
   * and sets them in HTTP-only cookies.
   */
  @UseGuards(GqlLocalAuthGuard)
  @Mutation(() => AuthTokens)
  async login(
    @Args('data') _loginData: LoginRequest,
    @CurrentUser() user: User,
    @Context() context: any, // Apollo context, so we can get `res`
  ): Promise<AuthTokens> {
    // 1) Generate tokens
    const tokens = await this.authService.login(user);

    // 2) Set them in secure, httpOnly cookies
    const res: Response = context.res;
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: false, // set to `true` in production with HTTPS
      sameSite: 'none', //set to 'strict' in production
      maxAge: 15 * 60 * 1000, // e.g. 15 minutes
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // e.g. 7 days
    });

    // 3) (Optional) still return tokens if your client wants them
    return tokens;
  }
}
