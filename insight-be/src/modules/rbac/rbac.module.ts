import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermissionsResolver } from './rbac.resolver';
import { UserModule } from 'src/modules/user/user.module';
import { RbacBootstrapService } from './rbac-bootstrap.service';
import { Permission } from './sub/permission/permission.entity';
import { PermissionResolver } from './sub/permission/permission.resolver';
import { PermissionService } from './sub/permission/permission.service';
import { Role } from './sub/role/role.entity';
import { RoleResolver } from './sub/role/role.resolver';
import { RoleService } from './sub/role/role.service';
import { DiscoveryModule } from '@nestjs/core';
import { ApiPermissionMappingService } from './sub/api-permissions-mapping/api-permission-mapping.service';
import { ApiPermissionMapping } from './sub/api-permissions-mapping/api-permission-mapping.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission, ApiPermissionMapping]),
    UserModule,
    DiscoveryModule,
  ],
  providers: [
    RoleService,
    PermissionService,
    RoleResolver,
    PermissionResolver,
    UserPermissionsResolver,
    RbacBootstrapService,
    ApiPermissionMappingService,
  ],
  exports: [RoleService, PermissionService, ApiPermissionMappingService],
})
export class RbacModule {}
