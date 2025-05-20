import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { UpdateStudentProfileInput } from './inputs/update-student-profile.input';
import { CreateStudentProfileInput } from './inputs/create-student-profile.dto';
import { StudentProfileDto } from './dto/student-profile.dto';
import { StudentProfileEntity } from './student-profile.entity';

@Injectable()
export class StudentProfileService extends BaseService<
  StudentProfileDto,
  CreateStudentProfileInput,
  UpdateStudentProfileInput
> {
  constructor(
    @InjectRepository(StudentProfileEntity)
    private readonly studentProfileRepository: Repository<StudentProfileEntity>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(studentProfileRepository, dataSource);
  }
}
