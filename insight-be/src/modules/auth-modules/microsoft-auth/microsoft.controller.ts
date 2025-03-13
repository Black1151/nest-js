// src/auth-modules/microsoft-auth/microsoft.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth/microsoft')
export class MicrosoftController {
  @Get()
  @UseGuards(AuthGuard('microsoft'))
  async microsoftLogin() {
    // Redirect to Microsoft’s OAuth consent page
  }

  @Get('callback')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftCallback(@Req() req, @Res() res) {
    // If successful, req.user is set by MicrosoftStrategy - change this to something meaningful 
    return res.send('Microsoft login successful!');
  }
}
