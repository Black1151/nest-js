import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TopicEntity } from './topic.entity';
import { TopicService } from './topic.service';
import { TopicResolver } from './topic.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([TopicEntity])],
  providers: [TopicService, TopicResolver],
  exports: [TopicService],
})
export class TopicModule {}
