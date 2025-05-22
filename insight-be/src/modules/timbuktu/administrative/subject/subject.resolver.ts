import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateSubjectInput, UpdateSubjectInput } from './subject.inputs';
import { SubjectEntity } from './subject.entity';
import { createBaseResolver } from 'src/common/base.resolver';
import { SubjectService } from './subject.service';
import { RbacPermissionKey } from 'src/modules/rbac/decorators/resolver-permission-key.decorator';

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
    'search',
  ],
});

@Resolver(() => SubjectEntity)
export class SubjectResolver extends BaseSubjectResolver {
  constructor(private readonly subjectService: SubjectService) {
    super(subjectService);
  }

  // @Mutation(() => SubjectEntity)
  // @RbacPermissionKey('subject.createTest')
  // async createTest(@Args('data') data: CreateSubjectInput) {
  //   console.log('incoming data', data);
  //   return this.subjectService.createSubjectWithYearGroupAssociation(data);
  // }
}
