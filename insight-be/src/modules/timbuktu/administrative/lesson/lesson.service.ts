import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ThemeEntity } from '../theme/theme.entity';
import { validateStyleOverrides } from '../../../../validators/theme/style-overrides.validator';
import { BaseService } from 'src/common/base.service';
import { LessonEntity } from './lesson.entity';
import { CreateLessonInput, UpdateLessonInput } from './lesson.inputs';

@Injectable()
export class LessonService extends BaseService<
  LessonEntity,
  CreateLessonInput,
  UpdateLessonInput
> {
  constructor(
    @InjectRepository(LessonEntity)
    lessonRepository: Repository<LessonEntity>,
    @InjectRepository(ThemeEntity)
    private readonly themeRepository: Repository<ThemeEntity>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(lessonRepository, dataSource);
  }

  async create(data: CreateLessonInput): Promise<LessonEntity> {
    const { themeId, relationIds = [], ...rest } = data as any;
    const theme = await this.themeRepository.findOneOrFail({ where: { id: themeId } });
    validateStyleOverrides(rest.content, Object.keys(theme.semanticTokens?.colors ?? {}));
    const relations = [...relationIds, { relation: 'theme', ids: [themeId] }];
    return super.create({ ...rest, relationIds: relations } as any);
  }

  async update(data: UpdateLessonInput): Promise<LessonEntity> {
    const { themeId, relationIds = [], ...rest } = data as any;
    let themeIdToUse = themeId;
    if (!themeIdToUse) {
      const existing = await this.repo.findOneOrFail({ where: { id: data.id } });
      themeIdToUse = existing.themeId;
    }
    if (rest.content) {
      const theme = await this.themeRepository.findOneOrFail({ where: { id: themeIdToUse } });
      validateStyleOverrides(rest.content, Object.keys(theme.semanticTokens?.colors ?? {}));
    }
    const relations = [
      ...relationIds,
      ...(themeId ? [{ relation: 'theme', ids: [themeId] }] : []),
    ];
    return super.update({ ...rest, relationIds: relations } as any);
  }

  async upgradeThemeVersion(
    lessonId: number,
    version: number,
  ): Promise<LessonEntity> {
    return this.dataSource.transaction(async (manager) => {
      const lessonRepo = manager.getRepository(LessonEntity);
      const themeRepo = manager.getRepository(ThemeEntity);

      const lesson = await lessonRepo.findOneOrFail({ where: { id: lessonId } });
      const theme = await themeRepo.findOneOrFail({ where: { id: lesson.themeId } });

      if (theme.version < version) {
        theme.version = version;
        await themeRepo.save(theme);
      }

      lesson.lastThemeUpgrade = new Date();
      await lessonRepo.save(lesson);

      return lessonRepo.findOneOrFail({ where: { id: lessonId }, relations: ['theme'] });
    });
  }
}
