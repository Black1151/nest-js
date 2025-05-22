import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { ClassEntity } from './class.entity';
import {
  ClassByYearSubjectInput,
  CreateClassInput,
  UpdateClassInput,
} from './class.inputs';
import { FindAllInput } from 'src/common/base.inputs';

@Injectable()
export class ClassService extends BaseService<
  ClassEntity,
  CreateClassInput,
  UpdateClassInput
> {
  constructor(
    @InjectRepository(ClassEntity)
    classRepository: Repository<ClassEntity>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(classRepository, dataSource);
  }

  async findByYearAndSubject(
    input: ClassByYearSubjectInput,
  ): Promise<ClassEntity[]> {
    const {
      yearGroupId,
      subjectId,
      withStudents = false,
      withEducators = false,
    } = input;

    console.log('yearGroupId', yearGroupId);
    console.log('subjectId', subjectId);

    const qb = this.repo
      .createQueryBuilder('cls')
      .innerJoin('cls.yearGroup', 'yg', 'yg.id = :yearGroupId', { yearGroupId })
      .innerJoin('cls.subject', 'sub', 'sub.id = :subjectId', { subjectId });

    if (withStudents) {
      qb.leftJoinAndSelect('cls.students', 'stu');
    }
    if (withEducators) {
      qb.leftJoinAndSelect('cls.educators', 'edu');
    }

    return qb.orderBy('cls.name', 'ASC').getMany();
  }
}
