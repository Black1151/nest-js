import { Resolver } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { AssignmentSubmissionService } from './assignment-submission.service';
import { AssignmentSubmissionEntity } from './assignment-submission.entity';
import { CreateAssignmentSubmissionInput } from './assignment-submission.inputs';
import { UpdateAssignmentSubmissionInput } from './assignment-submission.inputs';

const BaseAssignmentSubmissionResolver = createBaseResolver<
  AssignmentSubmissionEntity,
  CreateAssignmentSubmissionInput,
  UpdateAssignmentSubmissionInput
>(
  AssignmentSubmissionEntity,
  CreateAssignmentSubmissionInput,
  UpdateAssignmentSubmissionInput,
  {
    queryName: 'AssignmentSubmission',
    stableKeyPrefix: 'assignmentSubmission',
    enabledOperations: [
      'findAll',
      'findOne',
      'findOneBy',
      'create',
      'update',
      'remove',
    ],
  },
);

@Resolver(() => AssignmentSubmissionEntity)
export class AssignmentSubmissionResolver extends BaseAssignmentSubmissionResolver {
  constructor(
    private readonly assignmentSubmissionService: AssignmentSubmissionService,
  ) {
    super(assignmentSubmissionService);
  }
}
