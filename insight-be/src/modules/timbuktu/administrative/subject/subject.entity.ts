// ────────────────────────────────────────────────────────────────────────────
// src/modules/education/subject.entity.ts
// ────────────────────────────────────────────────────────────────────────────
import { Entity, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { AbstractBaseEntity } from 'src/common/base.entity';
import { YearGroupEntity } from '../year-group/year-group.entity';
import { TopicEntity } from '../topic/topic.entity';
import { LessonEntity } from '../lesson/lesson.entity';

@ObjectType()
@Entity('subjects')
export class SubjectEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  name: string; // e.g. "Maths"

  /* ---------- relationships ---------- */

  @Field(() => [TopicEntity], { nullable: true })
  @OneToMany(() => TopicEntity, (topic) => topic.subject)
  topics?: TopicEntity[];

  @Field(() => [LessonEntity], { nullable: true })
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
