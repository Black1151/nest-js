import { Resolver } from '@nestjs/graphql';

import { KeyStageEntity } from './key-stage.entity';
import { createBaseResolver } from 'src/common/base.resolver';

import { CreateKeyStageInput, UpdateKeyStageInput } from './key-stage.inputs';
import { KeyStageService } from './key-stage.service';

const BaseKeyStageResolver = createBaseResolver<
  KeyStageEntity,
  CreateKeyStageInput,
  UpdateKeyStageInput
>(KeyStageEntity, CreateKeyStageInput, UpdateKeyStageInput, {
  queryName: 'KeyStage',
  stableKeyPrefix: 'keyStage',
  enabledOperations: [
    'findAll',
    'findOne',
    'findOneBy',
    'create',
    'update',
    'remove',
    'search',
  ],
  immutableOperations: ['create', 'update', 'remove'],
});

@Resolver(() => KeyStageEntity)
export class KeyStageResolver extends BaseKeyStageResolver {
  constructor(private readonly keyStageService: KeyStageService) {
    super(keyStageService);
  }
}
