import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EducatorProfileService } from './educator-profile.service';
import { EducatorProfileResolver } from './educator-profile.resolver';
import { EducatorProfileEntity } from './educator-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EducatorProfileEntity])],
  providers: [EducatorProfileService, EducatorProfileResolver],
  exports: [EducatorProfileService],
})
export class EducatorProfileModule {}
