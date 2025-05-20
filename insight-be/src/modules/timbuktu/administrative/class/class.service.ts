import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { ClassEntity } from './class.entity';
import { CreateClassInput, UpdateClassInput } from './class.inputs';
import { YearGroupEntity } from '../year-group/year-group.entity';
import { SubjectEntity } from '../subject/subject.entity';
import { EducatorProfileEntity } from '../../user-profiles/educator-profile/educator-profile.entity';
import { StudentProfileEntity } from '../../user-profiles/student-profile/student-profile.entity';

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

  /**
   * Create a class and attach educator & student relations.
   * Validates uniqueness of class name within a year group + subject.
   */
  async createWithRelations(data: CreateClassInput): Promise<ClassEntity> {
    return this.dataSource.transaction(async (manager) => {
      const classRepo = manager.getRepository(ClassEntity);

      // Ensure unique name within year group & subject
      if (data.yearGroupId && data.subjectId) {
        const existing = await classRepo.findOne({
          where: {
            name: data.name.trim(),
            yearGroup: { id: data.yearGroupId },
            subject: { id: data.subjectId },
          } as any,
        });
        if (existing) {
          throw new BadRequestException(
            'A class with this name already exists for this year group and subject.',
          );
        }
      }

      const entity = classRepo.create({ name: data.name.trim() });

      if (data.yearGroupId) {
        entity.yearGroup = await manager
          .getRepository(YearGroupEntity)
          .findOneByOrFail({ id: data.yearGroupId });
      }

      if (data.subjectId) {
        entity.subject = await manager
          .getRepository(SubjectEntity)
          .findOneByOrFail({ id: data.subjectId });
      }

      if (data.educatorIds?.length) {
        const educators = await manager
          .getRepository(EducatorProfileEntity)
          .find({ where: { id: In(data.educatorIds) } });
        if (educators.length !== data.educatorIds.length) {
          throw new BadRequestException('Invalid educator ids provided');
        }
        entity.educators = educators;
      }

      if (data.studentIds?.length) {
        const students = await manager
          .getRepository(StudentProfileEntity)
          .find({ where: { id: In(data.studentIds) } });
        if (students.length !== data.studentIds.length) {
          throw new BadRequestException('Invalid student ids provided');
        }
        entity.students = students;
      }

      const saved = await classRepo.save(entity);

      return classRepo.findOneOrFail({
        where: { id: saved.id },
        relations: ['yearGroup', 'subject', 'educators', 'students'],
      });
    });
  }
}
