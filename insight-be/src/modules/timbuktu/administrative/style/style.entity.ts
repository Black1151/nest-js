import { Column, Entity, ManyToOne, RelationId, JoinColumn } from 'typeorm';
import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AbstractBaseEntity } from 'src/common/base.entity';
import { StyleCollectionEntity } from '../style-collection/style-collection.entity';

export enum PageElementType {
  Text = 'text',
  Table = 'table',
  Image = 'image',
  Video = 'video',
  Quiz = 'quiz',
}

registerEnumType(PageElementType, { name: 'PageElementType' });

@ObjectType()
@Entity('styles')
export class StyleEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  name: string;

  @Field(() => PageElementType)
  @Column({ type: 'enum', enum: PageElementType })
  element: PageElementType;

  @Field(() => GraphQLJSONObject)
  @Column({ type: 'jsonb' })
  config: Record<string, any>;

  @Field(() => StyleCollectionEntity)
  @ManyToOne(() => StyleCollectionEntity, (collection) => collection.styles, {
    nullable: false,
  })
  @JoinColumn({ name: 'collection_id' })
  collection!: StyleCollectionEntity;

  @Field(() => ID)
  @Column({ name: 'collection_id' })
  @RelationId((style: StyleEntity) => style.collection)
  collectionId!: number;
}
