// src/modules/education/class-lesson.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { ObjectType } from '@nestjs/graphql';

import { AbstractBaseEntity } from 'src/common/base.entity';
import { ClassEntity } from '../../class/class.entity';
import { LessonEntity } from '../../lesson/lesson.entity';

@ObjectType()
@Entity('class_lessons')
export class ClassLessonEntity extends AbstractBaseEntity {
  @ManyToOne(() => ClassEntity, (cls) => cls.classLessons, {
    onDelete: 'CASCADE',
  })
  class!: ClassEntity;

  @ManyToOne(() => LessonEntity, { eager: true, onDelete: 'CASCADE' })
  lesson!: LessonEntity;

  /** Sequence within the class (1, 2, 3 …) */
  @Column({ type: 'smallint' })
  order!: number;

  /** Example of extra per-class flags */
  @Column({ default: false })
  isHomework!: boolean;
}
