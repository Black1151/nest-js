// base.resolver.ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ClassType } from 'type-graphql';
import { BaseService } from './base.service';
import { DeepPartial } from 'typeorm';

/**
 * Creates a fully-functional resolver with unique operation names:
 *   - queryNameFindAll
 *   - queryNameFindOne
 *   - queryNameCreate
 *   - queryNameUpdate
 *   - queryNameRemove
 *
 * @param queryName        A unique prefix (e.g. "user", "location") used in operation names
 * @param entityClass      The runtime class for the entity (e.g. `User`)
 * @param createDtoClass   The runtime class for the create DTO (e.g. `CreateUserDto`)
 * @param updateDtoClass   The runtime class for the update DTO (e.g. `UpdateUserDto`)
 */
export function createBaseResolver<
  T extends { id: number },
  CreateDto extends DeepPartial<T>,
  UpdateDto extends DeepPartial<T> & { id: T['id'] },
>(
  queryName: string,
  entityClass: ClassType<T>,
  createDtoClass: ClassType<CreateDto>,
  updateDtoClass: ClassType<UpdateDto>,
) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    public constructor(
      public readonly service: BaseService<T, CreateDto, UpdateDto>,
    ) {}

    @Query(() => [entityClass], { name: `${queryName}FindAll` })
    async findAll(
      @Args('limit', { type: () => Int, nullable: true }) limit?: number,
      @Args('offset', { type: () => Int, nullable: true }) offset?: number,
    ): Promise<T[]> {
      return this.service.findAll(limit, offset);
    }

    @Query(() => entityClass, { name: `${queryName}FindOne` })
    async findOne(
      @Args('id', { type: () => Int }) id: T['id'],
    ): Promise<T> {
      return this.service.findOne(id);
    }

    @Mutation(() => entityClass, { name: `${queryName}Create` })
    async create(
      @Args('data', { type: () => createDtoClass }) createDto: CreateDto,
    ): Promise<T> {
      return this.service.create(createDto);
    }

    @Mutation(() => entityClass, { name: `${queryName}Update` })
    async update(
      @Args('data', { type: () => updateDtoClass }) updateDto: UpdateDto,
    ): Promise<T> {
      return this.service.update(updateDto);
    }

    @Mutation(() => Boolean, { name: `${queryName}Remove` })
    async remove(
      @Args('id', { type: () => Int }) id: T['id'],
    ): Promise<boolean> {
      await this.service.remove(id);
      return true;
    }
  }

  return BaseResolverHost;
}
