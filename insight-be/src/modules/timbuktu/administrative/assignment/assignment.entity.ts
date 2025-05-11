// src/modules/education/assignment.entity.ts

import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

import { AbstractBaseEntity } from 'src/common/base.entity';
import { ClassEntity } from '../class/class.entity';
import { LessonEntity } from '../lesson/lesson.entity';
import { AssignmentSubmissionEntity } from '../assignment-submission/assignment-submission.entity';

@ObjectType()
@Entity('assignments')
export class AssignmentEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  title: string; // e.g. "Homework: Fractions Practice"

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  // The class this assignment belongs to
  @Field(() => ClassEntity)
  @ManyToOne(() => ClassEntity, (cls) => cls.assignments, { eager: true })
  class: ClassEntity;

  // The lesson upon which the assignment is based
  @Field(() => LessonEntity)
  @ManyToOne(() => LessonEntity, { eager: true })
  lesson: LessonEntity;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @OneToMany(
    () => AssignmentSubmissionEntity,
    (submission) => submission.assignment,
  )
  submissions?: AssignmentSubmissionEntity[];
}
