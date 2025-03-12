// src/auth-modules/google-auth/google.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth/google')
export class GoogleController {
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Passport automatically redirects to Google’s consent page
  }

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res) {
    return res.send('Google login successful!');
  }
}
