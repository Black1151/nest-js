import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  StrategyOptions,
  VerifyCallback,
} from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
      passReqToCallback: false,
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    /*
      "profile" typically includes:
      - profile.id (Google’s unique user ID)
      - profile.emails[0].value
      - profile.name.givenName
      - profile.name.familyName
      - etc.
    */
    try {
      // Use your AuthService to find or create the user in DB
      const user = await this.authService.validateOAuthUser(profile, 'google');
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
