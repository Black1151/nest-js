// src/auth-modules/microsoft-auth/microsoft.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-microsoft';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('AZURE_CLIENT_ID'),
      clientSecret: configService.get<string>('AZURE_CLIENT_SECRET'),
      callbackURL: `${configService.get<string>('BACKEND_BASE_URL')}/auth/microsoft/callback`,
      scope: ['user.read'],
      tenant: 'common', // For "common" tenant, or set a specific tenant ID
      // authorizationURL: ... // If needed, or override defaults
      // tokenURL: ...
      // userProfileURL: ...
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      // e.g., profile._json.mail or profile.emails[0] might hold the email
      const user = await this.authService.validateOAuthUser(
        profile,
        'microsoft',
      );
      return done(null, user);
    } catch (error) {
      return done(new UnauthorizedException(error), false);
    }
  }
}
