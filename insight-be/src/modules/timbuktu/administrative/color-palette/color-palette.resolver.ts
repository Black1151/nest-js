import { Args, Query, Resolver } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { ColorPaletteEntity } from './color-palette.entity';
import {
  CreateColorPaletteInput,
  UpdateColorPaletteInput,
  FindAllColorPaletteInput,
} from './color-palette.inputs';
import { RbacPermissionKey } from 'src/modules/rbac/decorators/resolver-permission-key.decorator';
import { ColorPaletteService } from './color-palette.service';

const BaseColorPaletteResolver = createBaseResolver<
  ColorPaletteEntity,
  CreateColorPaletteInput,
  UpdateColorPaletteInput
>(ColorPaletteEntity, CreateColorPaletteInput, UpdateColorPaletteInput, {
  queryName: 'ColorPalette',
  stableKeyPrefix: 'colorPalette',
  enabledOperations: ['findAll', 'findOne', 'create', 'update', 'remove'],
});

@Resolver(() => ColorPaletteEntity)
export class ColorPaletteResolver extends BaseColorPaletteResolver {
  constructor(private readonly paletteService: ColorPaletteService) {
    super(paletteService);
  }

  @Query(() => [ColorPaletteEntity], {
    name: 'getAllColorPalette',
    description: 'Returns all ColorPalette (optionally filtered)',
  })
  @RbacPermissionKey('colorPalette.getAllColorPalette')
  async findAll(
    @Args('data', { type: () => FindAllColorPaletteInput })
    data: FindAllColorPaletteInput,
  ): Promise<ColorPaletteEntity[]> {
    const { themeId, filters = [], ...rest } = data;
    const finalFilters = [
      ...filters,
      ...(themeId
        ? [{ column: 'themeId', value: themeId }]
        : []),
    ];
    return this.paletteService.findAll({ ...rest, filters: finalFilters });
  }
}
