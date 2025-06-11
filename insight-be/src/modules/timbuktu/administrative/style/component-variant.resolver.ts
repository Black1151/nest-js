import { Args, Query, Resolver } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { ComponentVariantEntity } from './component-variant.entity';
import {
  CreateComponentVariantInput,
  UpdateComponentVariantInput,
} from './component-variant.inputs';
import { ComponentVariantService } from './component-variant.service';
import { IdInput } from 'src/common/base.inputs';
import { RbacPermissionKey } from 'src/modules/rbac/decorators/resolver-permission-key.decorator';

const BaseComponentVariantResolver = createBaseResolver<
  ComponentVariantEntity,
  CreateComponentVariantInput,
  UpdateComponentVariantInput
>(ComponentVariantEntity, CreateComponentVariantInput, UpdateComponentVariantInput, {
  queryName: 'ComponentVariant',
  stableKeyPrefix: 'componentVariant',
  enabledOperations: [
    'findAll',
    'findOneBy',
    'create',
    'update',
    'remove',
    'search',
  ],
});

@Resolver(() => ComponentVariantEntity)
export class ComponentVariantResolver extends BaseComponentVariantResolver {
  constructor(private readonly variantService: ComponentVariantService) {
    super(variantService);
  }

  @Query(() => ComponentVariantEntity, {
    name: 'getComponentVariant',
    description: 'Returns one ComponentVariant',
  })
  @RbacPermissionKey('componentVariant.getComponentVariant')
  async findOne(
    @Args('data', { type: () => IdInput }) data: IdInput,
  ): Promise<ComponentVariantEntity> {
    return this.variantService.findOne(data.id);
  }
}
