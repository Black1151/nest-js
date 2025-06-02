import { Resolver } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { StyleCollectionEntity } from './style-collection.entity';
import { StyleCollectionService } from './style-collection.service';
import {
  CreateStyleCollectionInput,
  UpdateStyleCollectionInput,
} from './style-collection.inputs';

const BaseResolver = createBaseResolver<
  StyleCollectionEntity,
  CreateStyleCollectionInput,
  UpdateStyleCollectionInput
>(
  StyleCollectionEntity,
  CreateStyleCollectionInput,
  UpdateStyleCollectionInput,
  {
    queryName: 'StyleCollection',
    stableKeyPrefix: 'styleCollection',
    enabledOperations: [
      'findAll',
      'findOne',
      'findOneBy',
      'create',
      'update',
      'remove',
      'search',
    ],
  },
);

@Resolver(() => StyleCollectionEntity)
export class StyleCollectionResolver extends BaseResolver {
  constructor(readonly service: StyleCollectionService) {
    super(service);
  }
}
