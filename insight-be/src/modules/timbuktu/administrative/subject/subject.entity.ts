// src/modules/education/subject.entity.ts
import { Entity, Column, ManyToMany, OneToMany } from 'typeorm';
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

  /** NEW: which year groups offer this subject */
  @Field(() => [YearGroupEntity], { nullable: true })
  @ManyToMany(() => YearGroupEntity, (yg) => yg.subjects, { nullable: true })
  yearGroups?: YearGroupEntity[];
}
