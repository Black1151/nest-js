import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractBaseEntity } from 'src/common/base.entity';

@ObjectType()
export class EducatorProfileDto extends AbstractBaseEntity {
  @Field(() => Number)
  staffId: number;
}
