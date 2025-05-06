import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractBaseEntity } from 'src/common/base.entity';

@ObjectType()
export class StudentProfileDto extends AbstractBaseEntity {
  @Field(() => Number)
  studentId: number;

  @Field(() => Number)
  schoolYear: number;
}
