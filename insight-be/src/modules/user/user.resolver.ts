// user.resolver.ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './user.service';
import { User } from './user.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RbacPermissionKey } from '../rbac/decorators/resolver-permission-key.decorator';
import { ImmutableLogging } from '../audit/decorators/immutable-logging.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => User)
  @RbacPermissionKey('user.create')
  @ImmutableLogging()
  async create(@Args('data') data: CreateUserDto): Promise<User> {
    return this.userService.create(data);
  }

  @Mutation(() => User)
  @RbacPermissionKey('user.update')
  @ImmutableLogging()
  async updateUserByPublicId(
    @Args('publicId', { type: () => String }) publicId: string,
    @Args('data') data: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateByPublicId(publicId, data);
  }

  @Mutation(() => User)
  @RbacPermissionKey('user.addRoles')
  @ImmutableLogging()
  async addRolesToUser(
    @Args('publicId', { type: () => String }) publicId: string,
    @Args('roleIds', { type: () => [Int] }) roleIds: number[],
  ) {
    return this.userService.addRoles(publicId, roleIds);
  }

  @Mutation(() => User)
  @RbacPermissionKey('user.removeRoles')
  @ImmutableLogging()
  async removeRolesFromUser(
    @Args('publicId', { type: () => String }) publicId: string,
    @Args('roleIds', { type: () => [Int] }) roleIds: number[],
  ) {
    return this.userService.removeRoles(publicId, roleIds);
  }

  @Mutation(() => Boolean)
  @RbacPermissionKey('user.remove')
  @ImmutableLogging()
  async removeUser(
    @Args('publicId', { type: () => String }) publicId: string,
  ): Promise<boolean> {
    await this.userService.removeByPublicId(publicId);
    return true;
  }
}
