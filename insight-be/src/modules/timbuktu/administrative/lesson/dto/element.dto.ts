import { Field, ObjectType, InputType, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { PageElementType } from '../../style/page-element-type';

@InputType('LessonElementInput')
@ObjectType('LessonElement')
export class ElementInput {
  @Field()
  id: string;

  @Field(() => ID, { nullable: true })
  styleId?: number;

  @Field(() => ID, { nullable: true })
  variantId?: number;

  @Field(() => PageElementType)
  type: PageElementType;

  @Field({ nullable: true })
  text?: string;

  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  src?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  questions?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  table?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  styleOverrides?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  wrapperStyles?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  animation?: Record<string, any>;
}

export { ElementInput as ElementDto };
