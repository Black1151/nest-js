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
      case 'apple':
        // Apple uses "sub" for the user’s unique ID. Email might be in "email".
        providerId = profile.sub;
        email = profile.email;
        break;
      // If you add more providers (Microsoft, etc.), handle them here
      default:
        throw new UnauthorizedException(`Unknown provider: ${provider}`);
    }

    if (!providerId) {
      throw new UnauthorizedException(`No providerId found for provider: ${provider}`);
    }

    // Find if we have a user with this providerId
    let user = await this.userService.findByProviderId(provider, providerId);

    if (!user) {
      // Optionally, see if we have an existing user with the same email to link
      if (email) {
        user = await this.userService.findByEmail(email);
      }

      // If still no user, create a new one
      if (!user) {
        user = await this.userService.create({
          email: email || '', // Apple might not always provide email
          firstName: '',      // Google might give profile.name.givenName
          lastName: '',       // ...
          password: '',       // Not needed for SSO-based accounts
        });
      }

      // Store the provider-specific ID so we can look up next time
      user = await this.userService.linkProviderId(user, provider, providerId);
    }

    return user;
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
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'myRefreshKey',
    });
    return { accessToken, refreshToken };
  }

  /**
   * Verify refresh token, issue new access + refresh tokens
   */
  async refreshToken(token: string): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'myRefreshKey',
      });
      const userId = payload.sub;

      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token (user not found)');
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
