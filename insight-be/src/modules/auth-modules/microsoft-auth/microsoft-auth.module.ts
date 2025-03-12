// src/auth-modules/microsoft-auth/microsoft-auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { MicrosoftStrategy } from './microsoft.strategy';
import { MicrosoftController } from './microsoft.controller';

@Module({
  imports: [AuthModule, PassportModule],
  providers: [MicrosoftStrategy],
  controllers: [MicrosoftController],
})
export class MicrosoftAuthModule {}
