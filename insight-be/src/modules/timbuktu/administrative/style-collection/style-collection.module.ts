import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StyleCollectionEntity } from './style-collection.entity';
import { ElementStyleEntity } from '../element-style/element-style.entity';
import { StyleCollectionService } from './style-collection.service';
import { StyleCollectionResolver } from './style-collection.resolver';
import { ElementStyleService } from '../element-style/element-style.service';
import { ElementStyleResolver } from '../element-style/element-style.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([StyleCollectionEntity, ElementStyleEntity]),
  ],
  providers: [
    StyleCollectionService,
    ElementStyleService,
    StyleCollectionResolver,
    ElementStyleResolver,
  ],
  exports: [StyleCollectionService, ElementStyleService],
})
export class StyleCollectionModule {}
