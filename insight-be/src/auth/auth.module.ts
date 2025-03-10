// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module'; // or wherever your User stuff is
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { AppleStrategy } from './strategies/apple.strategy';
import { MicrosoftStrategy } from './strategies/microsoft.strategy';
import { UsersService } from 'src/user/user.service';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'mySecretKey',
        signOptions: {
          expiresIn: '1h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    UsersService,
    AuthResolver,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    AuthService,
    UsersService,
    GoogleStrategy,
    AppleStrategy,
    MicrosoftStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
