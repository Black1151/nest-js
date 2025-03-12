import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.model';
import { AuthModule } from './modules/auth-modules/auth/auth.module';
import { LocalAuthModule } from './modules/auth-modules/local-auth/local-auth.module';
import { OktaAuthModule } from './modules/auth-modules/okta-auth/okta-auth.module';
import { GoogleAuthModule } from './modules/auth-modules/google-auth/google-auth.module';
import { MicrosoftAuthModule } from './modules/auth-modules/microsoft-auth/microsoft-auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      csrfPrevention: false,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '', 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available in any module
    }),
    UserModule,
    AuthModule,
    LocalAuthModule,
    OktaAuthModule,
    GoogleAuthModule,
    MicrosoftAuthModule,
  ],
})
export class AppModule {}
