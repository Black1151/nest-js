import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssignmentSubmissionEntity } from './assignment-submission.entity';
import { AssignmentSubmissionService } from './assignment-submission.service';
import { AssignmentSubmissionResolver } from './assignment-submission.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([AssignmentSubmissionEntity])],
  providers: [AssignmentSubmissionService, AssignmentSubmissionResolver],
  exports: [AssignmentSubmissionService],
})
export class AssignmentSubmissionModule {}
