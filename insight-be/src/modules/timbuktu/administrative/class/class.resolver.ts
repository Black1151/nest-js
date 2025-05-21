import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { createBaseResolver } from 'src/common/base.resolver';
import { ClassService } from './class.service';
import { ClassEntity } from './class.entity';
import { CreateClassInput } from './class.inputs';
import { UpdateClassInput } from './class.inputs';
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
  ],
});

@Resolver(() => ClassEntity)
export class ClassResolver extends BaseClassResolver {
  constructor(private readonly classService: ClassService) {
    super(classService);
  }

  @RbacPermissionKey('class.createWithRelations')
  @Mutation(() => ClassEntity, { name: 'createClass' })
  async create(@Args('data') data: CreateClassInput): Promise<ClassEntity> {
    return this.classService.createWithRelations(data);
  }
}
