import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.model';
import { Role } from 'src/modules/rbac/role/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UserResolver, UsersService],
  exports: [UsersService],
})
export class UserModule {}
