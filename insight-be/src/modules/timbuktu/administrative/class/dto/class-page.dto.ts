// src/modules/timbuktu/administrative/class/dto/class-page.dto.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { ClassEntity } from '../class.entity';
import { PageInfo } from 'src/common/utils/pagination.util';

@ObjectType()
export class ClassPage {
  @Field(() => [ClassEntity])
  data!: ClassEntity[];

  @Field(() => PageInfo)
  meta!: PageInfo;
}
