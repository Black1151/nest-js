// auth.service.ts
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
   * Called by the local strategy to validate user credentials.
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
   * For external SSO providers like Google, Apple, Microsoft, etc.
   * `profile` is the user profile object from the strategy.
   * `provider` is a string like 'google', 'apple', etc.
   */
  async validateOAuthUser(profile: any, provider: string): Promise<User> {
    let providerId: string;
    let email: string | undefined;

    switch (provider) {
      case 'google':
        providerId = profile.id;
        email = profile.emails?.[0]?.value;
        break;
      case 'microsoft':
        providerId = profile.id;
        email = profile.emails?.[0]?.value;
        break;
      default:
        throw new UnauthorizedException(`Unknown provider: ${provider}`);
    }

    if (!providerId) {
      throw new UnauthorizedException(
        `No providerId found for provider: ${provider}`,
      );
    }

    // 1. Find user by providerId
    const user = await this.userService.findByProviderId(provider, providerId);

    if (!user) {
      // 2. If not found by providerId, consider finding by email to see if
      //    we can link an existing user. If you prefer to do an explicit link
      //    process, skip automatically linking. Instead just throw an error:
      throw new UnauthorizedException(
        `No user is linked with ${provider} account ID "${providerId}".`,
      );
    }

    return user; // user found => done
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
   * Register a new user, hashing the password before storing.
   */
  async register(userData: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.userService.create({
      ...userData,
      password: hashedPassword,
    });
  }
}
