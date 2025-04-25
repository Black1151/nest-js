// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/modules/user/user.model';
import { UsersService } from 'src/modules/user/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthTokens } from './dto/res/auth-tokens.dto';
import { CreateUserRequestDto } from 'src/modules/user/dto/req/req.dto';
import { LoginResponse } from './dto/res/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Called by (Local) strategies to validate user credentials.
   */
  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  /**
   * Register a new user, hashing the password before storing.
   * (Local-only flow—could be moved to LocalAuthService if you prefer.)
   */
  async register(userData: CreateUserRequestDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.userService.create({
      ...userData,
      password: hashedPassword,
    });
  }

  // auth.service.ts
  async login(user: User): Promise<LoginResponse> {
    // const foundUser = await this.userService.findOneByEmail(user.email);

    const foundUser = await this.userService.getUserWithRolesAndPermissions(
      user.publicId,
    );

    const userDetails = {
      publicId: foundUser.publicId,
      permissions: foundUser['combinedPermissions'],
    };

    const accessPayload = userDetails;

    const refreshPayload = {
      publicId: foundUser.publicId,
    };

    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: '15m',
      secret: this.configService.get<string>('JWT_SECRET') || 'mySecretKey',
    });
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: '7d',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'zxcxzc',
    });
    return { accessToken, refreshToken, userDetails };
  }

  /**
   * Verify refresh token, issue new access + refresh tokens
   */
  async refreshToken(token: string): Promise<LoginResponse> {
    console.log('REFRESH TOKEN BACKEND HIT:', token);

    try {
      const payload = this.jwtService.verify(token, {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          'myRefreshKey',
      });
      const userId = payload.publicId;

      if (!userId) {
        throw new UnauthorizedException('An error occured during refresh');
      }

      const user = await this.userService.findOneByPublicId(userId);
      if (!user) {
        throw new UnauthorizedException('An error occured during refresh');
      }

      return this.login(user);
    } catch (e) {
      throw new UnauthorizedException('An error occured during refresh');
    }
  }

  /**
   * For SSO providers (Okta, Google, etc.).
   */
  async validateOAuthUser(profile: any, provider: string): Promise<User> {
    let email: string | undefined;
    switch (provider) {
      case 'okta':
        email = profile.emails?.[0]?.value || profile.email;
        break;
      default:
        throw new UnauthorizedException(`Unknown provider: ${provider}`);
    }

    if (!email) {
      throw new UnauthorizedException(`No email in ${provider} profile`);
    }

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      // Option: automatically create user if not found. Here, we deny access:
      throw new UnauthorizedException(
        `User with email ${email} does not exist in the DB, cannot sign in with ${provider}.`,
      );
    }

    return user;
  }
}
