// src/okta-auth/okta.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-openidconnect';
import { AuthService } from 'src/modules/auth-modules/auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OktaStrategy extends PassportStrategy(Strategy, 'okta') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      issuer: configService.get('OKTA_ISSUER'), // e.g. "https://dev-xxxxxx.okta.com/oauth2/default"
      authorizationURL: `${configService.get('OKTA_ISSUER')}/v1/authorize`,
      tokenURL: `${configService.get('OKTA_ISSUER')}/v1/token`,
      userInfoURL: `${configService.get('OKTA_ISSUER')}/v1/userinfo`,
      clientID: configService.get('OKTA_CLIENT_ID'),
      clientSecret: configService.get('OKTA_CLIENT_SECRET'),
      callbackURL:
        configService.get('OKTA_CALLBACK_URL') ||
        'http://localhost:3000/auth/okta/callback',
      scope: ['openid', 'profile', 'email'],
    });
  }

  async validate(
    issuer: string,
    sub: string,
    profile: any,
    jwtClaims: any,
    accessToken: string,
    refreshToken: string,
    verified: VerifyCallback,
  ): Promise<any> {
    try {
      // Typically, email might be in profile.emails[0].value
      const email = profile?.emails?.[0]?.value || profile?.email;
      if (!email) {
        return verified(new UnauthorizedException('No email in Okta profile'));
      }

      // Let AuthService handle the local user lookup
      const user = await this.authService.validateOAuthUser(profile, 'okta');
      return verified(null, user);
    } catch (error) {
      return verified(error, null);
    }
  }
}
