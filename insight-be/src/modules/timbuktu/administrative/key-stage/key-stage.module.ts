import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KeyStageEntity } from './key-stage.entity';
import { KeyStageService } from './key-stage.service';
import { KeyStageResolver } from './key-stage.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([KeyStageEntity])],
  providers: [KeyStageService, KeyStageResolver],
  exports: [KeyStageService],
})
export class KeyStageModule {}
