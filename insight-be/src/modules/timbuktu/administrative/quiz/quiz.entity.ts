import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { AbstractBaseEntity } from 'src/common/base.entity';
import { LessonEntity } from '../lesson/lesson.entity';
import { MultipleChoiceQuestionEntity } from '../multiple-choice-question/multiple-choice-question.entity';

@ObjectType()
@Entity('quizzes')
export class QuizEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  /* ---------- relationships ---------- */

  @Field(() => LessonEntity)
  @ManyToOne(() => LessonEntity, (lesson) => lesson.quizzes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  lesson: LessonEntity;

  @Field(() => [MultipleChoiceQuestionEntity], { nullable: true })
  @OneToMany(() => MultipleChoiceQuestionEntity, (mcq) => mcq.quiz)
  multipleChoiceQuestions?: MultipleChoiceQuestionEntity[];
}
