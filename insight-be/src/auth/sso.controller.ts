import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { SSOAuthRequest } from './strategies/interfaces/sso-auth-request.interface';

@Controller('auth')
export class SsoController {
  constructor(private readonly authService: AuthService) {}

  // 1) The 'initiate' route
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Starts Google OAuth (Passport auto-redirects to Google)
  }

  // 2) The callback route
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: SSOAuthRequest, @Res() res: Response) {
    const user = req.user;
    if (!user) {
      throw new Error('User not found');
    }
    const tokens = await this.authService.login(user);
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/sso?at=${tokens.accessToken}&rt=${tokens.refreshToken}`,
    );
  }

  @Get('microsoft')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftLogin() {
    // Starts Microsoft/Azure OAuth
  }

  @Get('microsoft/callback')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftCallback(@Req() req: SSOAuthRequest, @Res() res: Response) {
    const user = req.user;
    if (!user) {
      throw new Error('User not found');
    }
    const tokens = await this.authService.login(user);
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/sso?at=${tokens.accessToken}&rt=${tokens.refreshToken}`,
    );
  }
}
