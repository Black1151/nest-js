import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import AppleStrategyBase from 'passport-apple';
import { AuthService } from '../auth.service';


@Injectable()
export class AppleStrategy extends PassportStrategy(AppleStrategyBase, 'apple') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.APPLE_SERVICE_ID,    // e.g., "com.your.app.service"
      teamID: process.env.APPLE_TEAM_ID,         // e.g., "ABCDE12345"
      keyID: process.env.APPLE_KEY_ID,           // e.g., "ZZZZ9999"
      privateKeyString: process.env.APPLE_PRIVATE_KEY,
      callbackURL: process.env.APPLE_CALLBACK_URL || 'http://localhost:3000/auth/apple/callback',
      scope: ['email', 'name'],
    });
  }

  // The 'passport-apple' package provides a slightly different signature.
  // Typically, the validate callback is invoked with Apple’s response object.
  async validate(response: any, done: Function): Promise<any> {
    try {
      /*
        The "response" object should contain an id_token (JWT), user info, etc.
        In many Apple integrations, the user’s name is ONLY provided on the first login.
        For subsequent logins, Apple will only give you the user’s "sub" (Apple user ID) and email if user shares it.
      */
      const { idToken } = response; // This is a JWT token with Apple’s user claims
      // You might parse the idToken to extract "sub" (Apple's user ID), "email", etc.
      // A quick approach is to decode that token:
      const decoded = this.decodeIdToken(idToken);

      // Then pass to your "validateOAuthUser"
      const user = await this.authService.validateOAuthUser(decoded, 'apple');
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }

  private decodeIdToken(idToken: string) {
    // You could install a library like `jwt-decode` or `jsonwebtoken` to parse:
    // or do your own minimal decoding if needed.
    // For example:
    // const payload = jwt.verify(idToken, YOUR_APPLE_PUBLIC_KEY);
    // or if skipping verification (not recommended) just decode base64
    // (Below is just a placeholder approach; handle production needs carefully.)
    const base64Payload = idToken.split('.')[1];
    const payloadBuffer = Buffer.from(base64Payload, 'base64');
    const decoded = JSON.parse(payloadBuffer.toString());
    return decoded; // e.g., { sub: '000123.abc...', email: 'someEmail@appleid.com', ... }
  }
}
