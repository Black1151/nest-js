import { Resolver } from '@nestjs/graphql';
import { CreateSubjectInput, UpdateSubjectInput } from './subject.inputs';
import { SubjectEntity } from './subject.entity';
import { createBaseResolver } from 'src/common/base.resolver';
import { SubjectService } from './subject.service';

const BaseSubjectResolver = createBaseResolver<
  SubjectEntity,
  CreateSubjectInput,
  UpdateSubjectInput
>(SubjectEntity, CreateSubjectInput, UpdateSubjectInput, {
  queryName: 'Subject',
  stableKeyPrefix: 'subject',
  enabledOperations: [
    'findAll',
    'findOne',
    'findOneBy',
    'create',
    'update',
    'remove',
  ],
});

@Resolver(() => SubjectEntity)
export class SubjectResolver extends BaseSubjectResolver {
  constructor(private readonly subjectService: SubjectService) {
    super(subjectService);
  }
}
