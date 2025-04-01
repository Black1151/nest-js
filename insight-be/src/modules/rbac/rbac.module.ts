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
import { PermissionGroupResolver } from './sub/permission-group/permission-group.resolver';
import { PermissionGroupService } from './sub/permission-group/permission-group.service';
import { PermissionGroup } from './sub/permission-group/permission-group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      Permission,
      ApiPermissionMapping,
      PermissionGroup,
    ]),
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
    PermissionGroupService,
    PermissionGroupResolver,
  ],
  exports: [
    RoleService,
    PermissionService,
    ApiPermissionMappingService,
    PermissionGroupService,
  ],
})
export class RbacModule {}
