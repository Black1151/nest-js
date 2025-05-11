// src/modules/education/class.entity.ts
import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { AbstractBaseEntity } from 'src/common/base.entity';
import { AssignmentEntity } from '../assignment/assignment.entity';
import { EducatorProfileEntity } from '../../user-profiles/educator-profile/educator-profile.entity';
import { StudentProfileEntity } from '../../user-profiles/student-profile/student-profile.entity';
import { SubjectEntity } from '../subject/subject.entity';
import { YearGroupEntity } from '../year-group/year-group.entity';

import { EducatorProfileDto } from '../../user-profiles/educator-profile/dto/educator-profile.dto';
import { StudentProfileDto } from '../../user-profiles/student-profile/dto/student-profile.dto';
import { ClassLessonEntity } from '../pivot-tables/class-lesson/class-lesson.entity';

@ObjectType()
@Entity('classes')
export class ClassEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  name: string; // e.g. "7A Maths"

  @Field(() => YearGroupEntity, { nullable: true })
  @ManyToOne(() => YearGroupEntity, (yg) => yg.classes)
  yearGroup?: YearGroupEntity;

  @Field(() => SubjectEntity, { nullable: true })
  @ManyToOne(() => SubjectEntity)
  subject?: SubjectEntity;

  @Field(() => [EducatorProfileDto], { nullable: true })
  @ManyToMany(() => EducatorProfileEntity, { nullable: true })
  @JoinTable({
    name: 'class_educators',
    joinColumn: { name: 'class_id' },
    inverseJoinColumn: { name: 'educator_profile_id' },
  })
  educators?: EducatorProfileEntity[];

  @Field(() => [StudentProfileDto], { nullable: true })
  @ManyToMany(() => StudentProfileEntity)
  @JoinTable({
    name: 'class_students',
    joinColumn: { name: 'class_id' },
    inverseJoinColumn: { name: 'student_profile_id' },
  })
  students?: StudentProfileEntity[];

  @OneToMany(() => AssignmentEntity, (assignment) => assignment.class)
  assignments?: AssignmentEntity[];

  /** NEW: ordered lessons (pivot) */
  @OneToMany(() => ClassLessonEntity, (cl) => cl.class, {
    cascade: true,
  })
  classLessons?: ClassLessonEntity[];
}
