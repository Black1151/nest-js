// src/modules/education/lesson.entity.ts
import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  RelationId,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

import { AbstractBaseEntity } from 'src/common/base.entity';
import { EducatorProfileEntity } from '../../user-profiles/educator-profile/educator-profile.entity';
import { YearGroupEntity } from '../year-group/year-group.entity';
import { TopicEntity } from '../topic/topic.entity';
import { SubjectEntity } from '../subject/subject.entity';
import { EducatorProfileDto } from '../../user-profiles/educator-profile/dto/educator-profile.dto';
import { MultipleChoiceQuestionEntity } from '../multiple-choice-question/multiple-choice-question.entity';
import { QuizEntity } from '../quiz/quiz.entity';

@ObjectType()
@Entity('lessons')
export class LessonEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  content?: Record<string, any>;

  /* ---------- relationships ---------- */

  @Field(() => TopicEntity, { nullable: false })
  @ManyToOne(() => TopicEntity, (topic) => topic.lessons, { nullable: false })
  topic?: TopicEntity;

  @Field(() => SubjectEntity, { nullable: false })
  @ManyToOne(() => SubjectEntity, (subject) => subject.lessons, { nullable: false })
  subject!: SubjectEntity;

  @Field(() => [YearGroupEntity], { nullable: true })
  @ManyToMany(() => YearGroupEntity, { nullable: true })
  @JoinTable({
    name: 'lesson_year_groups',
    joinColumn: { name: 'lesson_id' },
    inverseJoinColumn: { name: 'year_group_id' },
  })
  recommendedYearGroups?: YearGroupEntity[];

  /** The educator who authored the lesson */
  @Field(() => EducatorProfileDto, { nullable: true })
  @ManyToOne(() => EducatorProfileEntity, { nullable: true })
  createdBy?: EducatorProfileEntity;

  /** Convenience ID field (avoids eager-loading the profile when not needed) */
  @Field(() => ID, { nullable: true })
  @RelationId((lesson: LessonEntity) => lesson.createdBy)
  createdById?: number;

  @Field(() => [MultipleChoiceQuestionEntity], { nullable: true })
  @OneToMany(() => MultipleChoiceQuestionEntity, (q) => q.lesson)
  multipleChoiceQuestions?: MultipleChoiceQuestionEntity[];

  @Field(() => [QuizEntity], { nullable: true })
  @OneToMany(() => QuizEntity, (quiz) => quiz.lesson)
  quizzes?: QuizEntity[];
}
