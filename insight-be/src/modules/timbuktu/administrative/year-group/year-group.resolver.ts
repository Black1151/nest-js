import { Resolver } from '@nestjs/graphql';

import { createBaseResolver } from 'src/common/base.resolver';
import { YearGroupService } from './year-group.service';
import {
  CreateYearGroupInput,
  UpdateYearGroupInput,
} from './year-group.inputs';
import { YearGroupEntity } from './year-group.entity';

const BaseYearGroupResolver = createBaseResolver<
  YearGroupEntity,
  CreateYearGroupInput,
  UpdateYearGroupInput
>(YearGroupEntity, CreateYearGroupInput, UpdateYearGroupInput, {
  queryName: 'YearGroup',
  stableKeyPrefix: 'yearGroup',
  enabledOperations: [
    'findAll',
    'findOne',
    'findOneBy',
    'create',
    'update',
    'remove',
  ],
});

@Resolver(() => YearGroupEntity)
export class YearGroupResolver extends BaseYearGroupResolver {
  constructor(private readonly yearGroupService: YearGroupService) {
    super(yearGroupService);
  }
}
