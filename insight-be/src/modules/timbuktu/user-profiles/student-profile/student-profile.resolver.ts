import { Resolver } from '@nestjs/graphql';

import { createBaseResolver } from 'src/common/base.resolver';

import { UpdateStudentProfileInput } from './inputs/update-student-profile.input';
import { StudentProfileService } from './student-profile.service';
import { StudentProfileDto } from './dto/student-profile.dto';
import { CreateStudentProfileInput } from './inputs/create-student-profile.dto';

const BaseStudentProfileResolver = createBaseResolver<
  StudentProfileDto,
  CreateStudentProfileInput,
  UpdateStudentProfileInput
>(StudentProfileDto, CreateStudentProfileInput, UpdateStudentProfileInput, {
  queryName: 'StudentProfile',
  stableKeyPrefix: 'studentProfile',
  enabledOperations: [
    'findAll',
    'findOne',
    'findOneBy',
    'create',
    'update',
    'remove',
    'search',
  ],
  immutableOperations: ['create', 'update', 'remove'],
});

@Resolver(() => StudentProfileDto)
export class StudentProfileResolver extends BaseStudentProfileResolver {
  constructor(private readonly studentProfileService: StudentProfileService) {
    super(studentProfileService);
  }
}
