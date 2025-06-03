import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AbstractBaseEntity } from 'src/common/base.entity';
import { StyleCollectionEntity } from '../style-collection/style-collection.entity';

export enum ElementType {
  TEXT = 'text',
  TABLE = 'table',
  IMAGE = 'image',
  VIDEO = 'video',
  QUIZ = 'quiz',
}

registerEnumType(ElementType, { name: 'ElementType' });

@ObjectType()
@Entity('styles')
export class StyleEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  name: string;

  @Field(() => ElementType)
  @Column({ type: 'enum', enum: ElementType })
  element: ElementType;

  @Field(() => GraphQLJSONObject)
  @Column({ type: 'jsonb' })
  config: Record<string, any>;

  @Field(() => StyleCollectionEntity)
  @ManyToOne(() => StyleCollectionEntity, (collection) => collection.styles, {
    nullable: false,
  })
  collection!: StyleCollectionEntity;

  @Field(() => ID)
  @RelationId((style: StyleEntity) => style.collection)
  collectionId!: number;
}
