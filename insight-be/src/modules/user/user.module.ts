import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.model';
import { Role } from 'src/modules/rbac/sub/role/role.entity';
import { BootstrapSuperAdminService } from './user-super-admin-bootstrap.service';
import { StudentProfileEntity } from '../timbuktu/user-profiles/student-profile/student-profile.entity';
import { EducatorProfileEntity } from '../timbuktu/user-profiles/educator-profile/educator-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      StudentProfileEntity,
      EducatorProfileEntity,
    ]),
  ],
  providers: [UserResolver, UsersService, BootstrapSuperAdminService],
  exports: [UsersService],
})
export class UserModule {}
