import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorPaletteEntity } from './color-palette.entity';
import { ColorPaletteResolver } from './color-palette.resolver';
import { ColorPaletteService } from './color-palette.service';

@Module({
  imports: [TypeOrmModule.forFeature([ColorPaletteEntity])],
  providers: [ColorPaletteService, ColorPaletteResolver],
  exports: [ColorPaletteService],
})
export class ColorPaletteModule {}
