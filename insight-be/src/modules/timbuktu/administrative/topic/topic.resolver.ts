import { Args, Query, Resolver } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { TopicEntity } from './topic.entity';
import {
  CreateTopicInput,
  UpdateTopicInput,
  TopicByYearSubjectInput,
} from './topic.inputs';
import { TopicService } from './topic.service';
import { RbacPermissionKey } from 'src/modules/rbac/decorators/resolver-permission-key.decorator';

const BaseTopicResolver = createBaseResolver<
  TopicEntity,
  CreateTopicInput,
  UpdateTopicInput
>(TopicEntity, CreateTopicInput, UpdateTopicInput, {
  queryName: 'Topic',
  stableKeyPrefix: 'topic',
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

@Resolver(() => TopicEntity)
export class TopicResolver extends BaseTopicResolver {
  constructor(private readonly topicService: TopicService) {
    super(topicService);
  }

  @RbacPermissionKey('topic.findAllByYearAndSubject')
  @Query(() => [TopicEntity])
  async topicsByYearAndSubject(
    @Args('input') input: TopicByYearSubjectInput,
  ): Promise<TopicEntity[]> {
    return this.topicService.findByYearAndSubject(input);
  }
}
