// okta.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-openidconnect';
import { AuthService } from '../auth.service'; // or wherever your auth service is
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
      // passReqToCallback: true, // if needed
    });
  }

  /**
   * This "validate" function gets called after Okta sends back user info.
   * `profile` typically includes the user's email, name, provider ID, etc.
   */
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
      // Example: The user info could be in `profile._json`
      // or you can rely on the userInfoURL returning the necessary fields
      const email = profile?.emails?.[0]?.value || profile?.email;
      if (!email) {
        return verified(new UnauthorizedException('No email in Okta profile'));
      }

      // Typically, you'd pass relevant user info to your AuthService
      // to find or create a local user record that is "linked" to Okta.
      const user = await this.authService.validateOAuthUser(
        profile,
        'okta', // or any string you prefer to identify the provider
      );

      // `user` is the local user we found or created. Return it:
      return verified(null, user);
    } catch (error) {
      return verified(error, null);
    }
  }
}
