// microsoft.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { OIDCStrategy, IProfile, VerifyCallback } from 'passport-azure-ad';
import { AuthService } from '../auth.service';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(
  OIDCStrategy,
  'microsoft',
) {
  constructor(private readonly authService: AuthService) {
    super({
      // For "passport-azure-ad" OIDCStrategy
      identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
      clientID: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      redirectUrl:
        process.env.AZURE_REDIRECT_URL ||
        'http://localhost:3000/auth/microsoft/callback',
      responseType: 'code',
      responseMode: 'query',
      // "scope" might include: openid, profile, email, offline_access
      scope: ['openid', 'profile', 'email'],
      passReqToCallback: false,
      allowHttpForRedirectUrl: process.env.NODE_ENV === 'development',
    });
  }

  async validate(profile: IProfile, done: VerifyCallback): Promise<any> {
    // "profile" might contain .oid or .sub as the unique user ID
    // plus the user's email in profile.upn or profile._json.preferred_username
    try {
      const user = await this.authService.validateOAuthUser(
        profile,
        'microsoft',
      );
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
}
