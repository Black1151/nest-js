// base.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ClassType } from 'type-graphql';
import { DeepPartial } from 'typeorm';
import { FindAllInput, IdInput } from './base.inputs'; // <-- import them
import { AbstractBaseEntity } from './base.entity';
import { BaseService } from './base.service';

/**
 * Creates a fully-functional resolver with unique operation names:
 *   - queryNameFindAll
 *   - queryNameFindOne
 *   - queryNameCreate
 *   - queryNameUpdate
 *   - queryNameRemove
 *
 * BUT each method now expects its parameters in the shape:
 *   data: { ...actualFields }
 *
 * e.g. "userCreate(data: CreateUserDto) { ... }"
 */
export function createBaseResolver<
  T extends AbstractBaseEntity,
  CreateDto extends DeepPartial<T>,
  UpdateDto extends DeepPartial<T> & { id: number },
>(
  queryName: string,
  entityClass: ClassType<T>,
  createDtoClass: ClassType<CreateDto>,
  updateDtoClass: ClassType<UpdateDto>,
) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    constructor(
      public readonly service: BaseService<T, CreateDto, UpdateDto>,
    ) {}

    @Query(() => [entityClass], { name: `${queryName}FindAll` })
    async findAll(
      @Args('data', { type: () => FindAllInput }) data: FindAllInput,
    ): Promise<T[]> {
      const { limit, offset } = data;
      return this.service.findAll(limit, offset);
    }

    @Query(() => entityClass, { name: `${queryName}FindOne` })
    async findOne(
      @Args('data', { type: () => IdInput }) data: IdInput,
    ): Promise<T> {
      console.log('FindOne data:', data);
      return this.service.findOne(data.id);
    }

    @Mutation(() => entityClass, { name: `${queryName}Create` })
    async create(
      @Args('data', { type: () => createDtoClass }) data: CreateDto,
    ): Promise<T> {
      return this.service.create(data);
    }

    @Mutation(() => entityClass, { name: `${queryName}Update` })
    async update(
      @Args('data', { type: () => updateDtoClass }) data: UpdateDto,
    ): Promise<T> {
      return this.service.update(data);
    }

    @Mutation(() => Boolean, { name: `${queryName}Remove` })
    async remove(
      @Args('data', { type: () => IdInput }) data: IdInput,
    ): Promise<boolean> {
      await this.service.remove(data.id);
      return true;
    }
  }

  return BaseResolverHost;
}
