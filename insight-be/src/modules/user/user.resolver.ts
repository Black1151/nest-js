// user.resolver.ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './user.service';
import { User } from './user.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { createBaseResolver } from 'src/common/base.resolver';
import { CreateUserDto } from './dto/create-user.dto';
import { IdInput } from 'src/common/base.inputs';
import { RbacPermissionKey } from '../rbac/decorators/resolver-permission-key.decorator';

const BaseUserResolver = createBaseResolver<User, CreateUserDto, UpdateUserDto>(
  User,
  CreateUserDto,
  UpdateUserDto,
  {
    queryName: 'user',
    stableKeyPrefix: 'USER',
  },
);

@Resolver(() => User)
export class UserResolver extends BaseUserResolver {
  constructor(private readonly userService: UsersService) {
    super(userService);
  }

  @Mutation(() => User)
  @RbacPermissionKey('USER.create')
  override async create(data: CreateUserDto): Promise<User> {
    return this.userService.create(data);
  }

  @Mutation(() => User)
  @RbacPermissionKey('USER.update')
  async updateUserByPublicId(
    @Args('publicId', { type: () => String }) publicId: string,
    @Args('data') data: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateByPublicId(publicId, data);
  }

  @Mutation(() => User)
  @RbacPermissionKey('USER.addRoles')
  async addRolesToUser(
    @Args('publicId', { type: () => String }) publicId: string,
    @Args('roleIds', { type: () => [Int] }) roleIds: number[],
  ) {
    return this.userService.addRoles(publicId, roleIds);
  }

  @Mutation(() => User)
  @RbacPermissionKey('USER.removeRoles')
  async removeRolesFromUser(
    @Args('publicId', { type: () => String }) publicId: string,
    @Args('roleIds', { type: () => [Int] }) roleIds: number[],
  ) {
    return this.userService.removeRoles(publicId, roleIds);
  }
}
