import { Args, Query, Resolver } from '@nestjs/graphql';

import { createBaseResolver } from 'src/common/base.resolver';
import { ClassService } from './class.service';
import { ClassEntity } from './class.entity';
import { ClassByYearSubjectInput, CreateClassInput } from './class.inputs';
import { UpdateClassInput } from './class.inputs';
import { FindAllInput } from 'src/common/base.inputs';
import { RbacPermissionKey } from 'src/modules/rbac/decorators/resolver-permission-key.decorator';

const BaseClassResolver = createBaseResolver<
  ClassEntity,
  CreateClassInput,
  UpdateClassInput
>(ClassEntity, CreateClassInput, UpdateClassInput, {
  queryName: 'Class',
  stableKeyPrefix: 'class',
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

@Resolver(() => ClassEntity)
export class ClassResolver extends BaseClassResolver {
  constructor(private readonly classService: ClassService) {
    super(classService);
  }
  @RbacPermissionKey('class.findAllByYearAndSubject')
  @Query(() => [ClassEntity])
  async classesByYearAndSubject(
    @Args('input') input: ClassByYearSubjectInput,
  ): Promise<ClassEntity[]> {
    return this.classService.findByYearAndSubject(input);
  }
}
