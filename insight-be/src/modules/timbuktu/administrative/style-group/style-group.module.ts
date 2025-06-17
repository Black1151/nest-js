import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StyleGroupEntity } from './style-group.entity';
import { StyleGroupResolver } from './style-group.resolver';
import { StyleGroupService } from './style-group.service';
import { StyleCollectionEntity } from '../style-collection/style-collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StyleGroupEntity, StyleCollectionEntity])],
  providers: [StyleGroupService, StyleGroupResolver],
  exports: [StyleGroupService],
})
export class StyleGroupModule {}
