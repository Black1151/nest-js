import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { ElementDto, ElementInput } from './element.dto';

@InputType('LessonColumnInput')
export class ColumnInput {
  @Field()
  columnId: string;

  @Field({ nullable: true })
  title?: string;

  @Field(() => [ElementInput])
  items: ElementInput[];

  @Field(() => GraphQLJSONObject, { nullable: true })
  wrapperStyles?: Record<string, any>;

  @Field({ nullable: true })
  spacing?: number;
}

@ObjectType('LessonColumn')
export class ColumnDto extends ColumnInput {
  @Field(() => [ElementDto])
  override items: ElementDto[];
}
