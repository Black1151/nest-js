// user.resolver.ts
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ObjectType,
  Field,
  ID,
} from '@nestjs/graphql';
import { UsersService } from './user.service';
import { User } from './user.model';

import { RbacPermissionKey } from '../rbac/decorators/resolver-permission-key.decorator';
import { ImmutableLogging } from '../audit/decorators/immutable-logging.decorator';
import { UiErrorMessageOverride } from 'src/decorators/error-message-override.decorator';

import { Role } from '../rbac/sub/role/role.entity';
import {
  PaginatedGetAllRequestDto,
  PublicIdRequestDto,
  CreateUserRequestDto,
  UpdateUserRequestDto,
  UpdateUserRolesFromArrayRequestDto,
} from './dto/req/req.dto';
import { CreateUserWithProfileInput } from './input/create-user-with-profile.input';
import { UpdateUserWithProfileInput } from './input/update-user-with-profile-input';

@ObjectType()
export class RemoveUserResponse {
  @Field(() => ID)
  id!: string;
}

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => [User])
  @RbacPermissionKey('user.getAllUsers')
  @ImmutableLogging()
  async getAllUsers(
    @Args('data') data: PaginatedGetAllRequestDto,
  ): Promise<User[]> {
    const { limit, offset } = data;
    return this.userService.findAll(limit, offset);
  }

  @Query(() => User)
  @RbacPermissionKey('user.getUserByPublicId')
  @ImmutableLogging()
  async getUserByPublicId(
    @Args('data') data: PublicIdRequestDto,
  ): Promise<User> {
    return this.userService.findOneByPublicId(data.publicId);
  }

  @Mutation(() => User)
  @RbacPermissionKey('user.createUser')
  @ImmutableLogging()
  @UiErrorMessageOverride([
    {
      codeName: 'unique_violation',
      message: 'A user with this email address already exists.',
    },
  ])
  async createUser(@Args('data') data: CreateUserRequestDto): Promise<User> {
    return this.userService.create(data);
  }

  @Mutation(() => User)
  @RbacPermissionKey('user.createUser')
  @ImmutableLogging()
  @UiErrorMessageOverride([
    {
      codeName: 'unique_violation',
      message: 'A user with this email address already exists.',
    },
  ])
  async createUserWithProfile(
    @Args('data') data: CreateUserWithProfileInput,
  ): Promise<User> {
    return this.userService.createUserWithProfile(data);
  }

  @Mutation(() => User)
  @RbacPermissionKey('user.updateUserByPublicId')
  @ImmutableLogging()
  @UiErrorMessageOverride([
    {
      codeName: 'unique_violation',
      message: 'A user with this email address already exists.',
    },
  ])
  async updateUserByPublicId(
    @Args('publicId', { type: () => String }) publicId: string,
    @Args('data') data: UpdateUserWithProfileInput,
  ): Promise<User> {
    return this.userService.updateUserWithProfile(publicId, data);
  }

  @Mutation(() => User)
  @RbacPermissionKey('user.updateUserRolesFromArray')
  @ImmutableLogging()
  async updateUserRolesFromArray(
    @Args('data') data: UpdateUserRolesFromArrayRequestDto,
  ): Promise<User> {
    return this.userService.updateUserRolesFromArray(
      data.publicId,
      data.roleIds,
    );
  }

  // async addRolesToUser(
  //   @Args('publicId', { type: () => String }) publicId: string,
  //   @Args('roleIds', { type: () => [Int] }) roleIds: number[],
  // ) {
  //   return this.userService.addRoles(publicId, roleIds);
  // }

  // @Mutation(() => User)
  // @RbacPermissionKey('user.removeRoles')
  // @ImmutableLogging()
  // async removeRolesFromUser(
  //   @Args('publicId', { type: () => String }) publicId: string,
  //   @Args('roleIds', { type: () => [Int] }) roleIds: number[],
  // ) {
  //   return this.userService.removeRoles(publicId, roleIds);
  // }

  @Query(() => [Role])
  @RbacPermissionKey('user.getRolesForUser')
  @ImmutableLogging()
  async getRolesForUser(
    @Args('data') data: PublicIdRequestDto,
  ): Promise<Role[]> {
    return this.userService.getRolesForUser(data.publicId);
  }

  @Mutation(() => User)
  @RbacPermissionKey('user.removeUserByPublicId')
  @ImmutableLogging()
  async removeUserByPublicId(
    @Args('data') data: PublicIdRequestDto,
  ): Promise<User> {
    return this.userService.removeByPublicId(data.publicId);
  }
}
