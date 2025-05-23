// src/modules/education/assignment.entity.ts

import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

import { AbstractBaseEntity } from 'src/common/base.entity';
import { ClassEntity } from '../class/class.entity';
import { LessonEntity } from '../lesson/lesson.entity';
import { EducatorProfileEntity } from '../../user-profiles/educator-profile/educator-profile.entity';
import { StudentProfileEntity } from '../../user-profiles/student-profile/student-profile.entity';
import { AssignmentSubmissionEntity } from '../assignment-submission/assignment-submission.entity';

@ObjectType()
@Entity('assignments')
export class AssignmentEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  name: string; // e.g. "Homework: Fractions Practice"

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  // The class this assignment belongs to
  @Field(() => ClassEntity)
  @ManyToOne(() => ClassEntity, (cls) => cls.assignments, { eager: true })
  class: ClassEntity;

  // Optional lessons this assignment references
  @Field(() => [LessonEntity], { nullable: true })
  @ManyToMany(() => LessonEntity, { eager: true })
  @JoinTable({
    name: 'assignment_lessons',
    joinColumn: { name: 'assignment_id' },
    inverseJoinColumn: { name: 'lesson_id' },
  })
  lessons?: LessonEntity[];

  @Field(() => [EducatorProfileEntity], { nullable: true })
  @ManyToMany(() => EducatorProfileEntity, { eager: true })
  @JoinTable({
    name: 'assignment_educators',
    joinColumn: { name: 'assignment_id' },
    inverseJoinColumn: { name: 'educator_profile_id' },
  })
  educators?: EducatorProfileEntity[];

  @Field(() => [StudentProfileEntity], { nullable: true })
  @ManyToMany(() => StudentProfileEntity, { eager: true })
  @JoinTable({
    name: 'assignment_students',
    joinColumn: { name: 'assignment_id' },
    inverseJoinColumn: { name: 'student_profile_id' },
  })
  students?: StudentProfileEntity[];

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @OneToMany(
    () => AssignmentSubmissionEntity,
    (submission) => submission.assignment,
  )
  submissions?: AssignmentSubmissionEntity[];
}
