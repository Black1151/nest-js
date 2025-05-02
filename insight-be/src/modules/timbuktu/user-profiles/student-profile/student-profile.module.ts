import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentProfileService } from './student-profile.service';
import { StudentProfileResolver } from './student-profile.resolver';
import { StudentProfileEntity } from './student-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentProfileEntity])],
  providers: [StudentProfileService, StudentProfileResolver],
  exports: [StudentProfileService],
})
export class StudentProfileModule {}
