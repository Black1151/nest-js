import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { ColumnDto, ColumnInput } from './column.dto';

@InputType('LessonSlideInput')
export class SlideInput {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field(() => [ColumnInput])
  columns: ColumnInput[];
}

@ObjectType('LessonSlide')
export class SlideDto extends SlideInput {
  @Field(() => [ColumnDto])
  declare columns: ColumnDto[];
}
