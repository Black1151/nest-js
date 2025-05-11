import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubjectEntity } from './subject.entity';
import { SubjectService } from './subject.service';
import { SubjectResolver } from './subject.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([SubjectEntity])],
  providers: [SubjectService, SubjectResolver],
  exports: [SubjectService],
})
export class SubjectModule {}
