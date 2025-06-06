import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorPaletteEntity } from './color-palette.entity';
import { ColorPaletteResolver } from './color-palette.resolver';
import { ColorPaletteService } from './color-palette.service';
import { StyleCollectionEntity } from '../style-collection/style-collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ColorPaletteEntity, StyleCollectionEntity])],
  providers: [ColorPaletteService, ColorPaletteResolver],
  exports: [ColorPaletteService],
})
export class ColorPaletteModule {}
