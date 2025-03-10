import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class SsoController {
  constructor(private readonly authService: AuthService) {}

  //-------------------------
  //       GOOGLE
  //-------------------------
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    // user is attached to req.user
    const user = req.user as any;
    // sign them in with your existing JWT approach
    const tokens = await this.authService.login(user);
    // redirect or respond
    return res.redirect(`http://localhost:3001/some-route?at=${tokens.accessToken}`);
  }

  //-------------------------
  //       APPLE
  //-------------------------
  @Get('apple')
  @UseGuards(AuthGuard('apple'))
  async appleAuth() {
    // Initiates Apple login flow
  }

  @Get('apple/callback')
  @UseGuards(AuthGuard('apple'))
  async appleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    const tokens = await this.authService.login(user);
    return res.redirect(`http://localhost:3001/some-route?at=${tokens.accessToken}`);
  }

  //-------------------------
  //     MICROSOFT
  //-------------------------
  @Get('microsoft')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftAuth() {
    // Initiates Microsoft/Azure login flow
  }

  @Get('microsoft/callback')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    const tokens = await this.authService.login(user);
    return res.redirect(`http://localhost:3001/some-route?at=${tokens.accessToken}`);
  }
}
