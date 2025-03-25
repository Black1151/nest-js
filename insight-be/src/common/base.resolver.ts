// base.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ClassType } from 'type-graphql';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { FindAllInput, FindOneByInput, IdInput } from './base.inputs';
import { AbstractBaseEntity } from './base.entity';
import { BaseService } from './base.service';
import { RbacPermissionKey } from 'src/modules/rbac/decorators/resolver-permission-key.decorator';

interface BaseResolverOptions<T extends AbstractBaseEntity> {
  queryName: string;
  stableKeyPrefix: string;
}

export function createBaseResolver<
  T extends AbstractBaseEntity,
  CreateDto extends DeepPartial<T>,
  UpdateDto extends DeepPartial<T> & { id: number },
>(
  entityClass: ClassType<T>,
  createDtoClass: ClassType<CreateDto>,
  updateDtoClass: ClassType<UpdateDto>,
  options: BaseResolverOptions<T>,
) {
  const { queryName, stableKeyPrefix } = options;

  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    constructor(
      public readonly service: BaseService<T, CreateDto, UpdateDto>,
    ) {}

    @Query(() => [entityClass], {
      name: `${queryName}FindAll`,
      description: `Find all ${queryName}`,
    })
    @RbacPermissionKey(`${stableKeyPrefix}.findAll`)
    async findAll(
      @Args('data', { type: () => FindAllInput }) data: FindAllInput,
    ): Promise<T[]> {
      const { limit, offset } = data;
      return this.service.findAll(limit, offset);
    }

    @Query(() => entityClass, {
      name: `${queryName}FindOne`,
      description: `Find one ${queryName}`,
    })
    @RbacPermissionKey(`${stableKeyPrefix}.findOne`)
    async findOne(
      @Args('data', { type: () => IdInput }) data: IdInput,
    ): Promise<T> {
      return this.service.findOne(data.id);
    }

    @Query(() => entityClass, {
      name: `${queryName}FindOneBy`,
      description: `Find one ${queryName} by given conditions`,
    })
    @RbacPermissionKey(`${stableKeyPrefix}.findOneBy`)
    async findOneBy(
      @Args('data', { type: () => FindOneByInput }) data: FindOneByInput,
    ): Promise<T> {
      return this.service.findOneBy({
        [data.column]: data.value,
      } as FindOptionsWhere<T>);
    }

    @Mutation(() => entityClass, {
      name: `${queryName}Create`,
      description: `Create one ${queryName}`,
    })
    @RbacPermissionKey(`${stableKeyPrefix}.create`)
    async create(
      @Args('data', { type: () => createDtoClass }) data: CreateDto,
    ): Promise<T> {
      return this.service.create(data);
    }

    @Mutation(() => entityClass, {
      name: `${queryName}Update`,
      description: `Update one ${queryName}`,
    })
    @RbacPermissionKey(`${stableKeyPrefix}.update`)
    async update(
      @Args('data', { type: () => updateDtoClass }) data: UpdateDto,
    ): Promise<T> {
      return this.service.update(data);
    }

    @Mutation(() => Boolean, {
      name: `${queryName}Remove`,
      description: `Remove one ${queryName}`,
    })
    @RbacPermissionKey(`${stableKeyPrefix}.remove`)
    async remove(
      @Args('data', { type: () => IdInput }) data: IdInput,
    ): Promise<boolean> {
      await this.service.remove(data.id);
      return true;
    }
  }

  return BaseResolverHost;
}
