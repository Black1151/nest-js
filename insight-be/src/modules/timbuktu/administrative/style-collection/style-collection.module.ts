import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StyleCollectionEntity } from './style-collection.entity';
import { StyleCollectionResolver } from './style-collection.resolver';
import { StyleCollectionService } from './style-collection.service';

@Module({
  imports: [TypeOrmModule.forFeature([StyleCollectionEntity])],
  providers: [StyleCollectionService, StyleCollectionResolver],
  exports: [StyleCollectionService],
})
export class StyleCollectionModule {}
