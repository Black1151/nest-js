import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemeEntity } from './theme.entity';
import { ThemeResolver } from './theme.resolver';
import { ThemeService } from './theme.service';
import { StyleCollectionEntity } from '../style-collection/style-collection.entity';
import { ColorPaletteEntity } from '../color-palette/color-palette.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ThemeEntity, StyleCollectionEntity, ColorPaletteEntity]),
  ],
  providers: [ThemeService, ThemeResolver],
  exports: [ThemeService],
})
export class ThemeModule {}
