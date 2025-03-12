// src/auth-modules/google-auth/google-auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthModule } from '../auth/auth.module';
import { GoogleStrategy } from './google.strategy';
import { GoogleController } from './google.controller';

@Module({
  imports: [AuthModule, PassportModule],
  providers: [GoogleStrategy],
  controllers: [GoogleController],
})
export class GoogleAuthModule {}
