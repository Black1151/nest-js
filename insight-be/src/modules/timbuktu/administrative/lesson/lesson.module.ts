import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonService } from './lesson.service';
import { LessonResolver } from './lesson.resolver';
import { LessonEntity } from './lesson.entity';
import { OpenAiModule } from '../../../openai/openai.module';

@Module({
  imports: [TypeOrmModule.forFeature([LessonEntity]), OpenAiModule],
  providers: [LessonService, LessonResolver],
  exports: [LessonService],
})
export class LessonModule {}
