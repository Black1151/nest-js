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
import { UpdateUserRequestDto } from './dto/req/update-user.request.dto';
import { CreateUserRequestDto } from './dto/req/create-user.request.dto';
import { RbacPermissionKey } from '../rbac/decorators/resolver-permission-key.decorator';
import { ImmutableLogging } from '../audit/decorators/immutable-logging.decorator';
import { UiErrorMessageOverride } from 'src/decorators/error-message-override.decorator';
import { PublicIdRequestDto } from './dto/req/public-id.request.dto';
import { PaginatedGetAllRequestDto } from './dto/req/paginated-get-all.request.dto';
import { Role } from '../rbac/sub/role/role.entity';

@ObjectType()
export class RemoveUserResponse {
  @Field(() => ID)
  id!: string;
}

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => [User])
  @RbacPermissionKey('user.findAll')
  @ImmutableLogging()
  async getAllUsers(
    @Args('data') data: PaginatedGetAllRequestDto,
  ): Promise<User[]> {
    const { limit, offset } = data;
    return this.userService.findAll(limit, offset);
  }

  @Query(() => User)
  @RbacPermissionKey('user.get')
  @ImmutableLogging()
  async getUserByPublicId(
    @Args('data') data: PublicIdRequestDto,
  ): Promise<User> {
    return this.userService.findOneByPublicId(data.publicId);
  }

  @Mutation(() => User)
  @RbacPermissionKey('user.create')
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
  @RbacPermissionKey('user.update')
  @ImmutableLogging()
  @UiErrorMessageOverride([
    {
      codeName: 'unique_violation',
      message: 'A user with this email address already exists.',
    },
  ])
  async updateUserByPublicId(
    @Args('publicId', { type: () => String }) publicId: string,
    @Args('data') data: UpdateUserRequestDto,
  ): Promise<User> {
    return this.userService.updateByPublicId(publicId, data);
  }

  @Mutation(() => User)
  @RbacPermissionKey('user.updateRoles')
  @ImmutableLogging()
  async updateRolesFromArray(
    @Args('publicId', { type: () => String }) publicId: string,
    @Args('roleIds', { type: () => [Int] }) roleIds: number[],
  ): Promise<User> {
    return this.userService.updateRolesFromArray(publicId, roleIds);
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
  @RbacPermissionKey('user.remove')
  @ImmutableLogging()
  async removeUserByPublicId(
    @Args('data') data: PublicIdRequestDto,
  ): Promise<User> {
    return this.userService.removeByPublicId(data.publicId);
  }
}
