import { Resolver } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { ColorPaletteEntity } from './color-palette.entity';
import { CreateColorPaletteInput, UpdateColorPaletteInput } from './color-palette.inputs';
import { ColorPaletteService } from './color-palette.service';

const BaseColorPaletteResolver = createBaseResolver<
  ColorPaletteEntity,
  CreateColorPaletteInput,
  UpdateColorPaletteInput
>(ColorPaletteEntity, CreateColorPaletteInput, UpdateColorPaletteInput, {
  queryName: 'ColorPalette',
  stableKeyPrefix: 'colorPalette',
  enabledOperations: [
    'findAll',
    'findOne',
    'findOneBy',
    'create',
    'update',
    'remove',
    'search',
  ],
});

@Resolver(() => ColorPaletteEntity)
export class ColorPaletteResolver extends BaseColorPaletteResolver {
  constructor(private readonly paletteService: ColorPaletteService) {
    super(paletteService);
  }
}
