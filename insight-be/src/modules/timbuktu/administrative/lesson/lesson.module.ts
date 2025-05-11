import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonService } from './lesson.service';
import { LessonResolver } from './lesson.resolver';
import { LessonEntity } from './lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LessonEntity])],
  providers: [LessonService, LessonResolver],
  exports: [LessonService],
})
export class LessonModule {}
