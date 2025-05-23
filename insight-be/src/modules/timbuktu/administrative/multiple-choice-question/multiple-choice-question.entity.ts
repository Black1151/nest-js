import { Entity, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { AbstractBaseEntity } from 'src/common/base.entity';
import { LessonEntity } from '../lesson/lesson.entity';

@ObjectType()
@Entity('multiple_choice_questions')
export class MultipleChoiceQuestionEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  text: string;

  @Field(() => [String])
  @Column('text', { array: true })
  options: string[];

  @Field()
  @Column()
  correctAnswer: string;

  @Field(() => LessonEntity)
  @ManyToOne(() => LessonEntity, (lesson) => lesson.multipleChoiceQuestions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  lesson: LessonEntity;
}
