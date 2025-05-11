import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from 'src/common/base.service';
import { KeyStageEntity } from './key-stage.entity';
import { CreateKeyStageInput, UpdateKeyStageInput } from './key-stage.inputs';

@Injectable()
export class KeyStageService extends BaseService<
  KeyStageEntity,
  CreateKeyStageInput,
  UpdateKeyStageInput
> {
  constructor(
    @InjectRepository(KeyStageEntity)
    keyStageRepository: Repository<KeyStageEntity>,
  ) {
    super(keyStageRepository);
  }
}
