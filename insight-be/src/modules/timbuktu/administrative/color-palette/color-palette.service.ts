import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService, FindAllOpts } from 'src/common/base.service';
import { ColorPaletteEntity } from './color-palette.entity';
import { CreateColorPaletteInput, UpdateColorPaletteInput } from './color-palette.inputs';

@Injectable()
export class ColorPaletteService extends BaseService<
  ColorPaletteEntity,
  CreateColorPaletteInput,
  UpdateColorPaletteInput
> {
  constructor(
    @InjectRepository(ColorPaletteEntity) paletteRepository: Repository<ColorPaletteEntity>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(paletteRepository, dataSource);
  }

  async create(data: CreateColorPaletteInput): Promise<ColorPaletteEntity> {
    const { themeId, relationIds = [], ...rest } = data;
    const relations = [
      ...relationIds,
      { relation: 'theme', ids: [themeId] },
    ];
    return super.create({ ...rest, relationIds: relations } as any);
  }

  async update(data: UpdateColorPaletteInput): Promise<ColorPaletteEntity> {
    const { themeId, relationIds = [], ...rest } = data;
    const relations = [
      ...relationIds,
      ...(themeId ? [{ relation: 'theme', ids: [themeId] }] : []),
    ];
    return super.update({ ...rest, relationIds: relations } as any);
  }

  async findAll(
    opts: FindAllOpts & { themeId?: number },
  ): Promise<ColorPaletteEntity[]> {
    const { themeId, filters = [], ...rest } = opts;
    const finalFilters = [
      ...filters,
      ...(themeId
        ? [{ column: 'themeId', value: themeId }]
        : []),
    ];
    return super.findAll({ ...rest, filters: finalFilters });
  }
}
