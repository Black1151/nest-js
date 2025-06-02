import { Resolver } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { StyleEntity } from './style.entity';
import { CreateStyleInput, UpdateStyleInput } from './style.inputs';
import { StyleService } from './style.service';

const BaseStyleResolver = createBaseResolver<
  StyleEntity,
  CreateStyleInput,
  UpdateStyleInput
>(StyleEntity, CreateStyleInput, UpdateStyleInput, {
  queryName: 'Style',
  stableKeyPrefix: 'style',
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

@Resolver(() => StyleEntity)
export class StyleResolver extends BaseStyleResolver {
  constructor(private readonly styleService: StyleService) {
    super(styleService);
  }
}
