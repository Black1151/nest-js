import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClassEntity } from './class.entity';
import { ClassService } from './class.service';
import { ClassResolver } from './class.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ClassEntity])],
  providers: [ClassService, ClassResolver],
  exports: [ClassService],
})
export class ClassModule {}
