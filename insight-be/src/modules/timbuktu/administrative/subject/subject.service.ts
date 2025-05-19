import { Injectable } from '@nestjs/common';
import {
  InjectRepository,
  InjectDataSource, //  <-- add this
} from '@nestjs/typeorm';
import { DataSource, Repository, In } from 'typeorm';

import { BaseService } from 'src/common/base.service';
import { SubjectEntity } from './subject.entity';
import { CreateSubjectInput, UpdateSubjectInput } from './subject.inputs';
import { YearGroupEntity } from '../year-group/year-group.entity';

@Injectable()
export class SubjectService extends BaseService<
  SubjectEntity,
  CreateSubjectInput,
  UpdateSubjectInput
> {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,

    // @InjectRepository(YearGroupEntity)
    // private readonly yearGroupRepository: Repository<YearGroupEntity>,

    @InjectDataSource() //  <-- pull in the DataSource
    private readonly dataSource: DataSource,
  ) {
    super(subjectRepository);
  }

  /**
   * Transaction-safe creation of a Subject plus any Year-Group relations.
   */
  async createSubjectWithYearGroupAssociation(
    data: CreateSubjectInput,
  ): Promise<SubjectEntity> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      /* 1️⃣  Create the subject and relations exactly as before … */
      const subject = qr.manager.create(SubjectEntity, { name: data.name });
      await qr.manager.save(subject);

      console.log('subject', subject);

      const yearGroupIds = data.relationIds?.flatMap((r) => r.ids) ?? [];

      console.log('yearGroupIds', yearGroupIds);

      if (yearGroupIds.length) {
        const yearGroups = await qr.manager.find(YearGroupEntity, {
          where: { id: In(yearGroupIds) },
        });
        subject.yearGroups = yearGroups;

        console.log('yearGroups', yearGroups);
        await qr.manager.save(subject);
      }

      /* 2️⃣  Commit so the data is visible to the outside world */
      await qr.commitTransaction();

      /* 3️⃣  NOW fetch it again with the default repository.
             The returned entity is no longer tied to qr.          */
      const freshSubject = await this.subjectRepository.findOneOrFail({
        where: { id: subject.id },
        relations: ['yearGroups'],
      });

      console.log('freshSubject', freshSubject);

      return freshSubject;
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release(); // <- only now do we free the runner
    }
  }
}
