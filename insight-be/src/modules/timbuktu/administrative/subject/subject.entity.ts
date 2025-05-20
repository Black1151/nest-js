// ────────────────────────────────────────────────────────────────────────────
// src/modules/education/subject.entity.ts
// ────────────────────────────────────────────────────────────────────────────
import { Entity, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { AbstractBaseEntity } from 'src/common/base.entity';
import { LessonEntity } from '../lesson/lesson.entity';
import { YearGroupEntity } from '../year-group/year-group.entity';

@ObjectType()
@Entity('subjects')
export class SubjectEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  name: string; // e.g. "Maths"

  /* ---------- relationships ---------- */

  @OneToMany(() => LessonEntity, (lesson) => lesson.subject)
  lessons?: LessonEntity[];

  @Field(() => [YearGroupEntity], { nullable: true })
  @ManyToMany(() => YearGroupEntity, (yg) => yg.subjects, {
    cascade: false,
  })
  @JoinTable({
    name: 'year_group_subjects',
    joinColumn: {
      name: 'subject_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'year_group_id',
      referencedColumnName: 'id',
    },
  })
  yearGroups?: YearGroupEntity[];
}
