// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/user.model';
import { UsersService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthTokens } from './dto/res/auth-tokens.dto';

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
    const user = await this.userService.findByEmail(email);
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
  async register(userData: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.userService.create({
      ...userData,
      password: hashedPassword,
    });
  }

  /**
   * Login: return both an access token and a refresh token.
   */
  async login(user: User): Promise<AuthTokens> {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.configService.get<string>('JWT_SECRET') || 'mySecretKey',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret:
        this.configService.get<string>('JWT_REFRESH_SECRET') || 'myRefreshKey',
    });
    return { accessToken, refreshToken };
  }

  /**
   * Verify refresh token, issue new access + refresh tokens
   */
  async refreshToken(token: string): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify(token, {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          'myRefreshKey',
      });
      const userId = payload.sub;

      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new UnauthorizedException(
          'Invalid refresh token (user not found)',
        );
      }

      return this.login(user);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
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
      // Add additional provider cases here as needed (Google, Microsoft, etc.)
      default:
        throw new UnauthorizedException(`Unknown provider: ${provider}`);
    }

    if (!email) {
      throw new UnauthorizedException(`No email in ${provider} profile`);
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      // Option: automatically create user if not found. Here, we deny access:
      throw new UnauthorizedException(
        `User with email ${email} does not exist in the DB, cannot sign in with ${provider}.`,
      );
    }

    return user;
  }
}
