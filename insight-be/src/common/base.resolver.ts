import { Resolver, Args } from '@nestjs/graphql';
import { ClassType } from 'type-graphql';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import {
  FindAllInput,
  FindOneByInput,
  IdInput,
  RelationIdsInput,
} from './base.inputs';
import { AbstractBaseEntity } from './base.entity';
import { BaseService } from './base.service';
import { QueryIf } from 'src/common/decorators/query-if.decorator';
import { MutationIf } from 'src/common/decorators/mutation-if.decorator';
import { ImmutableLoggingIf } from 'src/common/decorators/immutable-logging-if.decorator';
import { RbacPermissionKeyIf } from './decorators/rbac-permission-key-if.decorator';
import { UiErrorMessageOverride } from 'src/decorators/error-message-override.decorator';

type OperationName =
  | 'findAll'
  | 'findOne'
  | 'findOneBy'
  | 'create'
  | 'update'
  | 'remove';

interface BaseResolverOptions<T extends AbstractBaseEntity> {
  queryName: string;
  stableKeyPrefix: string;
  enabledOperations?: OperationName[];
  immutableOperations?: OperationName[];
}

export function createBaseResolver<
  T extends AbstractBaseEntity,
  CreateDto extends DeepPartial<T> & { relationIds?: RelationIdsInput[] }, // ⬅ CHANGED
  UpdateDto extends DeepPartial<T> & {
    id: number;
    relationIds?: RelationIdsInput[];
  }, // ⬅ CHANGED
>(
  entityClass: ClassType<T>,
  createDtoClass: ClassType<CreateDto>,
  updateDtoClass: ClassType<UpdateDto>,
  options: BaseResolverOptions<T>,
) {
  const {
    queryName,
    stableKeyPrefix,
    enabledOperations = [],
    immutableOperations = [],
  } = options;

  const isEnabled = (op: OperationName) => enabledOperations.includes(op);
  const isImmutable = (op: OperationName) => immutableOperations.includes(op);

  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    constructor(
      public readonly service: BaseService<T, CreateDto, UpdateDto>,
    ) {}

    /* ------------------------------------------------------------------ */
    /* findAll                                                            */
    /* ------------------------------------------------------------------ */
    @QueryIf(isEnabled('findAll'), () => [entityClass], {
      name: `getAll${queryName}`,
      description: `Returns all ${queryName} (optionally filtered)`,
    })
    @RbacPermissionKeyIf(
      isEnabled('findAll'),
      `${stableKeyPrefix}.getAll${queryName}`,
    )
    @ImmutableLoggingIf(isImmutable('findAll'))
    async findAll(
      @Args('data', { type: () => FindAllInput }) data: FindAllInput,
    ): Promise<T[]> {
      const { limit, offset, all, relations, filters } = data;
      return this.service.findAll({ limit, offset, all, relations, filters });
    }

    /* ------------------------------------------------------------------ */
    /* findOne (by id)                                                    */
    /* ------------------------------------------------------------------ */
    @QueryIf(isEnabled('findOne'), () => entityClass, {
      name: `get${queryName}`,
      description: `Returns one ${queryName}`,
    })
    @RbacPermissionKeyIf(
      isEnabled('findOne'),
      `${stableKeyPrefix}.get${queryName}`,
    )
    @ImmutableLoggingIf(isImmutable('findOne'))
    async findOne(
      @Args('data', { type: () => IdInput }) data: IdInput,
    ): Promise<T> {
      return this.service.findOne(data.id, data.relations);
    }

    /* ------------------------------------------------------------------ */
    /* findOneBy (arbitrary column)                                       */
    /* ------------------------------------------------------------------ */
    @QueryIf(isEnabled('findOneBy'), () => entityClass, {
      name: `get${queryName}By`,
      description: `Returns one ${queryName} by given conditions`,
    })
    @RbacPermissionKeyIf(
      isEnabled('findOneBy'),
      `${stableKeyPrefix}.get${queryName}By`,
    )
    @ImmutableLoggingIf(isImmutable('findOneBy'))
    async findOneBy(
      @Args('data', { type: () => FindOneByInput }) data: FindOneByInput,
    ): Promise<T> {
      return this.service.findOneBy(
        { [data.column]: data.value } as FindOptionsWhere<T>,
        data.relations,
      );
    }

    /* ------------------------------------------------------------------ */
    /* create                                                             */
    /* ------------------------------------------------------------------ */
    @MutationIf(isEnabled('create'), () => entityClass, {
      name: `create${queryName}`,
      description: `Create one ${queryName}`,
    })
    @RbacPermissionKeyIf(
      isEnabled('create'),
      `${stableKeyPrefix}.create${queryName}`,
    )
    @ImmutableLoggingIf(isImmutable('create'))
    @UiErrorMessageOverride([
      {
        codeName: 'unique_violation',
        message: `Cannot create: A ${queryName} with this name already exists.`,
      },
    ])
    async create(
      @Args('data', { type: () => createDtoClass }) data: CreateDto,
    ): Promise<T> {
      return this.service.create(data);
    }

    /* ------------------------------------------------------------------ */
    /* update                                                             */
    /* ------------------------------------------------------------------ */
    @MutationIf(isEnabled('update'), () => entityClass, {
      name: `update${queryName}`,
      description: `Updates one ${queryName}`,
    })
    @RbacPermissionKeyIf(
      isEnabled('update'),
      `${stableKeyPrefix}.update${queryName}`,
    )
    @ImmutableLoggingIf(isImmutable('update'))
    @UiErrorMessageOverride([
      {
        codeName: 'unique_violation',
        message: `Cannot update: A ${queryName} with this name already exists.`,
      },
    ])
    async update(
      @Args('data', { type: () => updateDtoClass }) data: UpdateDto,
    ): Promise<T> {
      return this.service.update(data);
    }

    /* ------------------------------------------------------------------ */
    /* remove                                                             */
    /* ------------------------------------------------------------------ */
    @MutationIf(isEnabled('remove'), () => Boolean, {
      name: `delete${queryName}`,
      description: `Delete one ${queryName}`,
    })
    @RbacPermissionKeyIf(
      isEnabled('remove'),
      `${stableKeyPrefix}.delete${queryName}`,
    )
    @ImmutableLoggingIf(isImmutable('remove'))
    async remove(
      @Args('data', { type: () => IdInput }) data: IdInput,
    ): Promise<number> {
      return this.service.remove(data.id);
    }
  }

  return BaseResolverHost;
}
