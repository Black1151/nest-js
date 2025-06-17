import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { ThemeEntity } from './theme.entity';
import { CreateThemeInput, UpdateThemeInput } from './theme.inputs';

@Injectable()
export class ThemeService extends BaseService<
  ThemeEntity,
  CreateThemeInput,
  UpdateThemeInput
> {
  constructor(
    @InjectRepository(ThemeEntity) themeRepository: Repository<ThemeEntity>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(themeRepository, dataSource);
  }

  async create(data: CreateThemeInput): Promise<ThemeEntity> {
    const { defaultPaletteId, relationIds = [], ...rest } = data;
    const relations = [
      ...relationIds,
      { relation: 'defaultPalette', ids: [defaultPaletteId] },
    ];
    return super.create({ ...rest, relationIds: relations } as any);
  }

  async update(data: UpdateThemeInput): Promise<ThemeEntity> {
    const { defaultPaletteId, relationIds = [], ...rest } = data;
    const relations = [
      ...relationIds,
      ...(defaultPaletteId
        ? [{ relation: 'defaultPalette', ids: [defaultPaletteId] }]
        : []),
    ];
    return super.update({ ...rest, relationIds: relations } as any);
  }
}
