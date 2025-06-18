import { Resolver } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { StyleCollectionEntity } from './style-collection.entity';
import {
  CreateStyleCollectionInput,
  UpdateStyleCollectionInput,
} from './style-collection.inputs';
import { StyleCollectionService } from './style-collection.service';

const BaseStyleCollectionResolver = createBaseResolver<
  StyleCollectionEntity,
  CreateStyleCollectionInput,
  UpdateStyleCollectionInput
>(StyleCollectionEntity, CreateStyleCollectionInput, UpdateStyleCollectionInput, {
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
});

@Resolver(() => StyleCollectionEntity)
export class StyleCollectionResolver extends BaseStyleCollectionResolver {
  constructor(private readonly collectionService: StyleCollectionService) {
    super(collectionService);
  }
}
