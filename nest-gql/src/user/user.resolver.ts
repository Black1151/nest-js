// import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
// import { UsersService } from './user.service';
// import { User } from './user.model';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { DeleteUserDto } from './dto/delete-user.dto';
// import { FindOneUserDto } from './dto/find-one-user.dto';
// import { FindAllUsersDto } from './dto/find-all-users.dto';

// @Resolver(() => User)
// export class UserResolver {
//   constructor(private readonly userService: UsersService) {}

//   @Query(() => [User])
//   findAllUsers(
//     @Args('data') findAllUsersDto: FindAllUsersDto,
//   ): Promise<User[]> {
//     return this.userService.findAll(findAllUsersDto);
//   }

//   @Query(() => User, { nullable: true })
//   findOneUser(
//     @Args('data') findOneUserDto: FindOneUserDto,
//   ): Promise<User | undefined> {
//     return this.userService.findOne(findOneUserDto.id);
//   }

//   @Mutation(() => User)
//   async createUser(@Args('data') createUserDto: CreateUserDto): Promise<User> {
//     return this.userService.create(createUserDto);
//   }

//   @Mutation(() => User)
//   async updateUser(@Args('data') updateUserDto: UpdateUserDto): Promise<User> {
//     return this.userService.update(updateUserDto);
//   }

//   @Mutation(() => Boolean)
//   async removeUser(
//     @Args('data') deleteUserDto: DeleteUserDto,
//   ): Promise<boolean> {
//     await this.userService.remove(deleteUserDto.id);
//     return true;
//   }
// }

// user.resolver.ts
import { Resolver } from '@nestjs/graphql';
import { createBaseResolver } from '../common/base.resolver';
import { User } from './user.model';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Pass "user" as the unique name, so the operations become:
// - userFindAll
// - userFindOne
// - userCreate
// - userUpdate
// - userRemove
const BaseUserResolver = createBaseResolver<User, CreateUserDto, UpdateUserDto>(
  'user',
  User,
  CreateUserDto,
  UpdateUserDto,
);

@Resolver(() => User)
export class UserResolver extends BaseUserResolver {
  constructor(service: UsersService) {
    super(service);
  }

  // If you have user-specific queries or mutations, add them here.
  // Otherwise, all CRUD ops are provided by the base resolver.
}
