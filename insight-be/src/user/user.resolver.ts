// user.resolver.ts
import { Args, Query, Resolver } from '@nestjs/graphql';
import { createBaseResolver } from '../common/base.resolver';
import { User } from './user.model';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @Query(() => User, { name: 'userFindOneByEmail' })
  async userFindOneByEmail(@Args('email') email: string): Promise<User> {
    return this.service.findOneBy({ email });
  }
}
