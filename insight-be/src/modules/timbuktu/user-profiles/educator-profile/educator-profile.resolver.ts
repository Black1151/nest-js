import { Resolver, Mutation, Args, Int, Query } from '@nestjs/graphql';

import { createBaseResolver } from 'src/common/base.resolver';

import { CreateEducatorProfileInput } from './inputs/create-educator-profile.input';
import { UpdateEducatorProfileInput } from './inputs/update-educator-profile.input';
import { EducatorProfileDto } from './dto/educator-profile.dto';
import { EducatorProfileService } from './educator-profile.service';

const BaseEducatorResolver = createBaseResolver<
  EducatorProfileDto,
  CreateEducatorProfileInput,
  UpdateEducatorProfileInput
>(EducatorProfileDto, CreateEducatorProfileInput, UpdateEducatorProfileInput, {
  queryName: 'EducatorProfile',
  stableKeyPrefix: 'educatorProfile',
  enabledOperations: [
    'findAll',
    'findOne',
    'findOneBy',
    'create',
    'update',
    'remove',
  ],
  immutableOperations: ['create', 'update', 'remove'],
});

@Resolver(() => EducatorProfileDto)
export class EducatorProfileResolver extends BaseEducatorResolver {
  constructor(private readonly educatorProfileService: EducatorProfileService) {
    super(educatorProfileService);
  }
}
