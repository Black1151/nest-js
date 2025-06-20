import { Column, Entity, ManyToOne, RelationId, JoinColumn } from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AbstractBaseEntity } from 'src/common/base.entity';
import { StyleCollectionEntity } from '../style-collection/style-collection.entity';
import { StyleGroupEntity } from '../style-group/style-group.entity';
import { PageElementType } from './page-element-type';

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

  @Field(() => StyleGroupEntity, { nullable: true })
  @ManyToOne(() => StyleGroupEntity, (group) => group.styles, { nullable: true })
  @JoinColumn({ name: 'group_id' })
  group?: StyleGroupEntity;

  @Field(() => ID, { nullable: true })
  @Column({ name: 'group_id', nullable: true })
  @RelationId((style: StyleEntity) => style.group)
  groupId?: number;
}
