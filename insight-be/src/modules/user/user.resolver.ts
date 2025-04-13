// user.resolver.ts
import { Resolver, Query, Mutation, Args, Int, ObjectType, Field, ID } from '@nestjs/graphql';
import { UsersService } from './user.service';
import { User } from './user.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RbacPermissionKey } from '../rbac/decorators/resolver-permission-key.decorator';
import { ImmutableLogging } from '../audit/decorators/immutable-logging.decorator';
import { FindAllInput } from 'src/common/base.inputs';
import { UiErrorMessageOverride } from 'src/decorators/error-message-override.decorator';

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
    @Args('data', { type: () => FindAllInput }) data: FindAllInput,
  ): Promise<User[]> {
    const { limit, offset } = data;
    return this.userService.findAll(limit, offset);
  }

  @Query(() => User)
  @RbacPermissionKey('user.get')
  @ImmutableLogging()
  async getUserByPublicId(
    @Args('publicId', { type: () => String }) publicId: string,
  ): Promise<User> {
    return this.userService.findOneByPublicId(publicId);
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
  async createUser(@Args('data') data: CreateUserDto): Promise<User> {
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



  @Mutation(() => RemoveUserResponse)
  @RbacPermissionKey('user.remove')
  @ImmutableLogging()
  async removeUserByPublicId(
    @Args('publicId', { type: () => String }) publicId: string,
  ): Promise<RemoveUserResponse> {
    await this.userService.removeByPublicId(publicId);
    return {
      id: publicId, 
    };
  }
}
