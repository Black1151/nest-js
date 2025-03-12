// src/okta-auth/okta-auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/modules/auth-modules/auth/auth.module';
import { OktaController } from './okta.controller';
import { OktaStrategy } from './okta.strategy';

@Module({
  imports: [AuthModule, PassportModule],
  controllers: [OktaController],
  providers: [OktaStrategy],
})
export class OktaAuthModule {}
