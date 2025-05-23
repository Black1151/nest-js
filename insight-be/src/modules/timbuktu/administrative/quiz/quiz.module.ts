import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizEntity } from './quiz.entity';
import { QuizService } from './quiz.service';
import { QuizResolver } from './quiz.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([QuizEntity])],
  providers: [QuizService, QuizResolver],
  exports: [QuizService],
})
export class QuizModule {}
