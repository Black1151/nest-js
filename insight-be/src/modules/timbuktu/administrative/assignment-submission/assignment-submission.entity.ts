// src/modules/education/assignment-submission.entity.ts

import { Entity, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

import { AbstractBaseEntity } from 'src/common/base.entity';
import { AssignmentEntity } from '../assignment/assignment.entity';
import { StudentProfileEntity } from '../../user-profiles/student-profile/student-profile.entity';
import { StudentProfileDto } from '../../user-profiles/student-profile/dto/student-profile.dto';

@ObjectType()
@Entity('assignment_submissions')
export class AssignmentSubmissionEntity extends AbstractBaseEntity {
  @Field(() => AssignmentEntity)
  @ManyToOne(() => AssignmentEntity, (assignment) => assignment.submissions)
  assignment: AssignmentEntity;

  @Field(() => StudentProfileDto)
  @ManyToOne(() => StudentProfileEntity)
  student: StudentProfileEntity;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  submittedAt?: Date;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  submissionContent?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  grade?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  feedback?: string;
}
