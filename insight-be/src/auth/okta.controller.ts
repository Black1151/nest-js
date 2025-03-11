// okta.controller.ts

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth/okta')
export class OktaController {
  // 1. Start the OAuth login flow
  @Get()
  @UseGuards(AuthGuard('okta'))
  async oktaLogin() {}

  // 2. Okta redirects back to this callback with code, etc.
  @Get('callback')
  @UseGuards(AuthGuard('okta'))
  oktaCallback(@Req() req, @Res() res) {
    // `req.user` is now the user object returned from the strategy validate() method

    // Option A: If you are using session-based auth, you can redirect somewhere:
    // e.g. res.redirect('/somewhere-logged-in');

    // Option B: If you are issuing a JWT token from the server:
    //  - Use your AuthService to sign a token.
    //  - Return it in a cookie or as JSON.
    // Example:
    // const tokens = this.authService.login(req.user);
    // res.json(tokens);

    return res.send('Okta SSO login successful!');
  }
}
