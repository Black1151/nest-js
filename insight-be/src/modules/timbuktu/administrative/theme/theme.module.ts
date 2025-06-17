import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemeEntity } from './theme.entity';
import { ThemeResolver } from './theme.resolver';
import { ThemeService } from './theme.service';
import { ColorPaletteEntity } from '../color-palette/color-palette.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ThemeEntity, ColorPaletteEntity])],
  providers: [ThemeService, ThemeResolver],
  exports: [ThemeService],
})
export class ThemeModule {}
