import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UsersService } from './user.service';
import { EmailInput, IdInput } from './user.inputs';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly service: UsersService) {}

  @Query(() => User, { name: 'userFindOneByEmail' })
  async userFindOneByEmail(
    @Args('data', { type: () => EmailInput }) data: EmailInput,
  ): Promise<User> {
    return this.service.findOneBy({ email: data.email });
  }

  @Query(() => User, { name: 'userFindOneById' })
  async userFindOneById(
    @Args('data', { type: () => IdInput }) data: IdInput,
  ): Promise<User> {
    return this.service.findOneBy({ id: data.id });
  }
}