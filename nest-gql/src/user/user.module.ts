import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.model';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserResolver, UsersService],
  exports: [UsersService],
})
export class UserModule {}
