import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StyleEntity } from './style.entity';
import { StyleResolver } from './style.resolver';
import { StyleService } from './style.service';
import { StyleCollectionEntity } from '../style-collection/style-collection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StyleEntity, StyleCollectionEntity]),
  ],
  providers: [StyleService, StyleResolver],
  exports: [StyleService],
})
export class StyleModule {}
