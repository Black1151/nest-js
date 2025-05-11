import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssignmentEntity } from './assignment.entity';
import { AssignmentService } from './assignment.service';
import { AssignmentResolver } from './assignment.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([AssignmentEntity])],
  providers: [AssignmentService, AssignmentResolver],
  exports: [AssignmentService],
})
export class AssignmentModule {}
