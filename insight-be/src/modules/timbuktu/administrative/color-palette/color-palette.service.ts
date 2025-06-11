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
    const { collectionId, relationIds = [], ...rest } = data;
    const relations = [
      ...relationIds,
      { relation: 'collection', ids: [collectionId] },
    ];
    return super.create({ ...rest, relationIds: relations } as any);
  }

  async update(data: UpdateColorPaletteInput): Promise<ColorPaletteEntity> {
    const { collectionId, relationIds = [], ...rest } = data;
    const relations = [
      ...relationIds,
      ...(collectionId ? [{ relation: 'collection', ids: [collectionId] }] : []),
    ];
    return super.update({ ...rest, relationIds: relations } as any);
  }

  async findAll(
    opts: FindAllOpts & { collectionId?: number },
  ): Promise<ColorPaletteEntity[]> {
    const { collectionId, filters = [], ...rest } = opts;
    const finalFilters = [
      ...filters,
      ...(collectionId
        ? [{ column: 'collectionId', value: collectionId }]
        : []),
    ];
    return super.findAll({ ...rest, filters: finalFilters });
  }

  async findOne(id: number, relations?: string[]): Promise<ColorPaletteEntity> {
    return super.findOne(id, relations);
  }
}
