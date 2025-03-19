// user.resolver.ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './user.service';
import { User } from './user.model';
import { UpdateUserDto } from './dto/update-user.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => [User])
  async users(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ) {
    return this.userService.findAllUsers(limit, offset);
  }

  // dont htink we need this, we can encode the necessary user data in the JWT token?
  @Query(() => User)
  async user(@Args('publicId', { type: () => String }) publicId: string) {
    return this.userService.findOneByPublicId(publicId);
  }


  @Mutation(() => User)
  async updateUser(
    @Args('publicId', { type: () => String }) publicId: string,
    @Args('data') data: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateByPublicId(publicId, data);
  }

  // There must be a more secure way of accomplishing this rather than exposing a mutation that can just remove users?
  @Mutation(() => Boolean)
  async removeUser(@Args('publicId', { type: () => String }) publicId: string) {
    await this.userService.removeByPublicId(publicId);
    return true;
  }

  @Mutation(() => User)
  async addRolesToUser(
    @Args('publicId', { type: () => String }) publicId: string,
    @Args('roleIds', { type: () => [Int] }) roleIds: number[],
  ) {
    return this.userService.addRoles(publicId, roleIds);
  }

  @Mutation(() => User)
  async removeRolesFromUser(
    @Args('publicId', { type: () => String }) publicId: string,
    @Args('roleIds', { type: () => [Int] }) roleIds: number[],
  ) {
    return this.userService.removeRoles(publicId, roleIds);
  }
}
