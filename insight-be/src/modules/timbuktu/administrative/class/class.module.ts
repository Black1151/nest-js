import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClassEntity } from './class.entity';
import { ClassService } from './class.service';
import { ClassResolver } from './class.resolver';
import { YearGroupEntity } from '../year-group/year-group.entity';
import { SubjectEntity } from '../subject/subject.entity';
import { EducatorProfileEntity } from '../../user-profiles/educator-profile/educator-profile.entity';
import { StudentProfileEntity } from '../../user-profiles/student-profile/student-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClassEntity,
      YearGroupEntity,
      SubjectEntity,
      EducatorProfileEntity,
      StudentProfileEntity,
    ]),
  ],
  providers: [ClassService, ClassResolver],
  exports: [ClassService],
})
export class ClassModule {}
