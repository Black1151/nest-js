import { Resolver } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { ElementStyleEntity } from './element-style.entity';
import { ElementStyleService } from './element-style.service';
import {
  CreateElementStyleInput,
  UpdateElementStyleInput,
} from './element-style.inputs';

const BaseResolver = createBaseResolver<
  ElementStyleEntity,
  CreateElementStyleInput,
  UpdateElementStyleInput
>(ElementStyleEntity, CreateElementStyleInput, UpdateElementStyleInput, {
  queryName: 'ElementStyle',
  stableKeyPrefix: 'elementStyle',
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

@Resolver(() => ElementStyleEntity)
export class ElementStyleResolver extends BaseResolver {
  constructor(private readonly service: ElementStyleService) {
    super(service);
  }
}
