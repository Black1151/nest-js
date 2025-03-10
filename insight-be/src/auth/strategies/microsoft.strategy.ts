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
      // single tenant
      identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
      // multi tenant
      // identityMetadata: `https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration`,
      clientID: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      redirectUrl: process.env.AZURE_REDIRECT_URL,
      responseType: 'code',
      responseMode: 'query',
      scope: ['openid', 'profile', 'email'],
      passReqToCallback: false,
      allowHttpForRedirectUrl: process.env.NODE_ENV === 'development',
      loggingLevel: 'debug',
      loggingNoPII: false,
    });
  }

  async validate(profile: IProfile, done: VerifyCallback): Promise<any> {
    try {
      profile.id = profile.oid;
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
