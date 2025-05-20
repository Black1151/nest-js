import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

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
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(keyStageRepository, dataSource);
  }
}
