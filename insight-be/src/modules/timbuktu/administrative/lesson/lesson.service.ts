import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { LessonEntity } from './lesson.entity';
import { CreateLessonInput, UpdateLessonInput } from './lesson.inputs';
import { StyleService } from '../style/style.service';
import { ThemeService } from '../theme/theme.service';

@Injectable()
export class LessonService extends BaseService<
  LessonEntity,
  CreateLessonInput,
  UpdateLessonInput
> {
  constructor(
    @InjectRepository(LessonEntity)
    lessonRepository: Repository<LessonEntity>,
    @InjectDataSource() dataSource: DataSource,
    private readonly styleService: StyleService,
    private readonly themeService: ThemeService,
  ) {
    super(lessonRepository, dataSource);
  }

  async findOne(id: number, relations?: string[]): Promise<LessonEntity> {
    const lesson = await super.findOne(id, relations);

    if (lesson.themeId && lesson.content?.slides) {
      const styleIds = new Set<number>();
      for (const slide of lesson.content.slides as any[]) {
        const columnMap = slide.columnMap ?? {};
        for (const col of Object.values(columnMap) as any[]) {
          if (Array.isArray(col.items)) {
            for (const item of col.items) {
              if (item.styleId) {
                styleIds.add(Number(item.styleId));
              }
            }
          }
        }
      }

      if (styleIds.size) {
        const styles = await this.styleService.findByIds(Array.from(styleIds));
        for (const slide of lesson.content.slides as any[]) {
          const columnMap = slide.columnMap ?? {};
          for (const col of Object.values(columnMap) as any[]) {
            if (Array.isArray(col.items)) {
              col.items = col.items.map((item: any) => {
                const style = styles.find((s) => s.id === item.styleId);
                if (style) {
                  const cfg = style.config as any;
                  return {
                    ...item,
                    styles: cfg.styles,
                    wrapperStyles: cfg.wrapperStyles,
                  };
                }
                return item;
              });
            }
          }
        }
      }
    }

    return lesson;
  }
}
