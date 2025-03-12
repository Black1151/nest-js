// src/local-auth/local-auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/modules/auth-modules/auth/auth.module';
import { LocalStrategy } from './local.strategy';
import { LocalAuthResolver } from './local-auth.resolver';

@Module({
  imports: [AuthModule, PassportModule],
  providers: [LocalStrategy, LocalAuthResolver],
})
export class LocalAuthModule {}
