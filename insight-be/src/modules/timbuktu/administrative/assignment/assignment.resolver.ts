import { Resolver } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { AssignmentService } from './assignment.service';
import {
  CreateAssignmentInput,
  UpdateAssignmentInput,
} from './assignment.inputs';
import { AssignmentEntity } from './assignment.entity';

const BaseAssignmentResolver = createBaseResolver<
  AssignmentEntity,
  CreateAssignmentInput,
  UpdateAssignmentInput
>(AssignmentEntity, CreateAssignmentInput, UpdateAssignmentInput, {
  queryName: 'Assignment',
  stableKeyPrefix: 'assignment',
  enabledOperations: [
    'findAll',
    'findOne',
    'findOneBy',
    'create',
    'update',
    'remove',
  ],
});

@Resolver(() => AssignmentEntity)
export class AssignmentResolver extends BaseAssignmentResolver {
  constructor(private readonly assignmentService: AssignmentService) {
    super(assignmentService);
  }
}
