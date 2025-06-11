import { Resolver } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { ComponentVariantEntity } from './component-variant.entity';
import {
  CreateComponentVariantInput,
  UpdateComponentVariantInput,
} from './component-variant.inputs';
import { ComponentVariantService } from './component-variant.service';

const BaseComponentVariantResolver = createBaseResolver<
  ComponentVariantEntity,
  CreateComponentVariantInput,
  UpdateComponentVariantInput
>(ComponentVariantEntity, CreateComponentVariantInput, UpdateComponentVariantInput, {
  queryName: 'ComponentVariant',
  stableKeyPrefix: 'componentVariant',
  enabledOperations: [
    'findAll',
    'findOne',
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
}
