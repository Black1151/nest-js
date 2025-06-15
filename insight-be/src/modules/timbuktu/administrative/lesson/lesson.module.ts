import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonService } from './lesson.service';
import { LessonResolver } from './lesson.resolver';
import { LessonEntity } from './lesson.entity';
import { StyleModule } from '../style/style.module';
import { ThemeModule } from '../theme/theme.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LessonEntity]),
    StyleModule,
    ThemeModule,
  ],
  providers: [LessonService, LessonResolver],
  exports: [LessonService],
})
export class LessonModule {}
