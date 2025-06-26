import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService, FindAllOpts } from 'src/common/base.service';
import { ColorPaletteEntity } from './color-palette.entity';
import { CreateColorPaletteInput, UpdateColorPaletteInput } from './color-palette.inputs';
import { StyleCollectionEntity } from '../style-collection/style-collection.entity';

@Injectable()
export class ColorPaletteService extends BaseService<
  ColorPaletteEntity,
  CreateColorPaletteInput,
  UpdateColorPaletteInput
> {
  constructor(
    @InjectRepository(ColorPaletteEntity) paletteRepository: Repository<ColorPaletteEntity>,
    @InjectRepository(StyleCollectionEntity)
    private readonly collectionRepository: Repository<StyleCollectionEntity>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(paletteRepository, dataSource);
  }

  async create(data: CreateColorPaletteInput): Promise<ColorPaletteEntity> {
    const { collectionId, relationIds = [], colors, ...rest } = data;

    const collection = await this.collectionRepository.findOneOrFail({
      where: { id: collectionId },
    });
    const missing = (collection.colorTokens || []).filter(
      (t) => !(t in (colors || {})),
    );
    if (missing.length) {
      throw new BadRequestException(
        `Missing color token${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`,
      );
    }

    const relations = [
      ...relationIds,
      { relation: 'collection', ids: [collectionId] },
    ];
    return super.create({ ...rest, colors, relationIds: relations } as any);
  }

  async update(data: UpdateColorPaletteInput): Promise<ColorPaletteEntity> {
    const { collectionId, relationIds = [], colors, ...rest } = data;

    if (collectionId) {
      const collection = await this.collectionRepository.findOneOrFail({
        where: { id: collectionId },
      });
      const missing = (collection.colorTokens || []).filter(
        (t) => !(t in (colors || {})),
      );
      if (missing.length) {
        throw new BadRequestException(
          `Missing color token${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`,
        );
      }
    }

    const relations = [
      ...relationIds,
      ...(collectionId ? [{ relation: 'collection', ids: [collectionId] }] : []),
    ];
    return super.update({ ...rest, colors, relationIds: relations } as any);
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
}
