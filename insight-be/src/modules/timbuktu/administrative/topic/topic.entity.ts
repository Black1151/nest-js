import { Entity, Column, ManyToOne, OneToMany, Unique, Index } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { AbstractBaseEntity } from 'src/common/base.entity';
import { SubjectEntity } from '../subject/subject.entity';
import { YearGroupEntity } from '../year-group/year-group.entity';
import { LessonEntity } from '../lesson/lesson.entity';

@ObjectType()
@Index('idx_topic_year_subject', ['yearGroup', 'subject'])
@Unique('uq_topic_year_subject_name', ['yearGroup', 'subject', 'name'])
@Entity('topics')
export class TopicEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  name: string;

  @Field(() => YearGroupEntity)
  @ManyToOne(() => YearGroupEntity, (yg) => yg.topics, { nullable: false })
  yearGroup!: YearGroupEntity;

  @Field(() => SubjectEntity)
  @ManyToOne(() => SubjectEntity, (sub) => sub.topics, { nullable: false })
  subject!: SubjectEntity;

  @Field(() => [LessonEntity], { nullable: true })
  @OneToMany(() => LessonEntity, (lesson) => lesson.topic)
  lessons?: LessonEntity[];
}
