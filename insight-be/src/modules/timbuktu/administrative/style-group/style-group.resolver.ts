import { Resolver } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { StyleGroupEntity } from './style-group.entity';
import { CreateStyleGroupInput, UpdateStyleGroupInput } from './style-group.inputs';
import { StyleGroupService } from './style-group.service';

const BaseStyleGroupResolver = createBaseResolver<
  StyleGroupEntity,
  CreateStyleGroupInput,
  UpdateStyleGroupInput
>(StyleGroupEntity, CreateStyleGroupInput, UpdateStyleGroupInput, {
  queryName: 'StyleGroup',
  stableKeyPrefix: 'styleGroup',
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

@Resolver(() => StyleGroupEntity)
export class StyleGroupResolver extends BaseStyleGroupResolver {
  constructor(private readonly groupService: StyleGroupService) {
    super(groupService);
  }
}
