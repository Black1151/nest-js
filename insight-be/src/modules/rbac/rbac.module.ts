import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionService } from './permission/permission.service';
import { PermissionResolver } from './permission/permission.resolver';
import { Role } from './role/role.entity';
import { Permission } from './permission/permission.entity';
import { RoleService } from './role/role.service';
import { RoleResolver } from './role/role.resolver';
import { UserPermissionsResolver } from './rbac.resolver';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission]), UserModule],
  providers: [RoleService, PermissionService, RoleResolver, PermissionResolver, UserPermissionsResolver],
  exports: [RoleService, PermissionService],
})
export class RbacModule {}
