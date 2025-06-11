import { Injectable } from '@nestjs/common';
import { validateSemanticTokenContrast } from '../../../../validators/theme/semantic-contrast.validator';
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
    const { styleCollectionId, defaultPaletteId, relationIds = [], ...rest } = data;
    validateSemanticTokenContrast(rest.foundationTokens, rest.semanticTokens);
    const relations = [
      ...relationIds,
      { relation: 'styleCollection', ids: [styleCollectionId] },
      { relation: 'defaultPalette', ids: [defaultPaletteId] },
    ];
    return super.create({ ...rest, relationIds: relations } as any);
  }

  async update(data: UpdateThemeInput): Promise<ThemeEntity> {
    const {
      styleCollectionId,
      defaultPaletteId,
      relationIds = [],
      ...rest
    } = data;
    const relations = [
      ...relationIds,
      ...(styleCollectionId
        ? [{ relation: 'styleCollection', ids: [styleCollectionId] }]
        : []),
      ...(defaultPaletteId
        ? [{ relation: 'defaultPalette', ids: [defaultPaletteId] }]
        : []),
    ];
    if (rest.foundationTokens && rest.semanticTokens) {
      validateSemanticTokenContrast(rest.foundationTokens, rest.semanticTokens);
    }
    return super.update({ ...rest, relationIds: relations } as any);
  }
}
