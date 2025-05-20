import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { CreateEducatorProfileInput } from './inputs/create-educator-profile.input';
import { EducatorProfileDto } from './dto/educator-profile.dto';
import { UpdateEducatorProfileInput } from './inputs/update-educator-profile.input';
import { EducatorProfileEntity } from './educator-profile.entity';

@Injectable()
export class EducatorProfileService extends BaseService<
  EducatorProfileDto,
  CreateEducatorProfileInput,
  UpdateEducatorProfileInput
> {
  constructor(
    @InjectRepository(EducatorProfileEntity)
    private readonly educatorProfileRepository: Repository<EducatorProfileEntity>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(educatorProfileRepository, dataSource);
  }
}
