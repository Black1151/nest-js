// src/okta-auth/okta.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth/okta')
export class OktaController {
  // 1. Start the OAuth login flow
  @Get()
  @UseGuards(AuthGuard('okta'))
  async oktaLogin() {
    // Passport will redirect to Okta’s hosted login page
  }

  // 2. Okta redirects back to this callback
  @Get('callback')
  @UseGuards(AuthGuard('okta'))
  oktaCallback(@Req() req, @Res() res) {
    // `req.user` is now the user object returned from OktaStrategy's validate() method
    // Example approach:
    // const tokens = this.authService.login(req.user);
    // res.json(tokens);
    return res.send('Okta SSO login successful!');
  }
}
