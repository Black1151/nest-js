import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.model';
import { AuthModule } from './modules/auth-modules/auth/auth.module';
import { LocalAuthModule } from './modules/auth-modules/local-auth/local-auth.module';
import { OktaAuthModule } from './modules/auth-modules/okta-auth/okta-auth.module';
import { GoogleAuthModule } from './modules/auth-modules/google-auth/google-auth.module';
import { MicrosoftAuthModule } from './modules/auth-modules/microsoft-auth/microsoft-auth.module';
import { ConfigModule } from '@nestjs/config';
import { RbacModule } from './modules/rbac/rbac.module';
import { Role } from './modules/rbac/sub/role/role.entity';
import { Permission } from './modules/rbac/sub/permission/permission.entity';
import { APP_GUARD, DiscoveryModule } from '@nestjs/core';
import { GqlJwtAuthGuard } from './guards/auth.guard';
import { ApiPermissionsGuard } from './modules/rbac/guards/api-permissions.guard';
import { ApiPermissionMapping } from './modules/rbac/sub/api-permissions-mapping/api-permission-mapping.entity';
import { BootstrapSuperAdminService } from './modules/user/user-super-admin-bootstrap.service';

@Module({
  imports: [
    DiscoveryModule,
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
      entities: [User, Role, Permission, ApiPermissionMapping],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    RbacModule,
    AuthModule,
    LocalAuthModule,
    OktaAuthModule,
    GoogleAuthModule,
    MicrosoftAuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlJwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ApiPermissionsGuard,
    },
  ],
})
export class AppModule {}
