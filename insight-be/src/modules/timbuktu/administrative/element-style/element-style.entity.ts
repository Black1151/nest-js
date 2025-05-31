import { Entity, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

import { AbstractBaseEntity } from 'src/common/base.entity';
import { StyleCollectionEntity } from '../style-collection/style-collection.entity';

@ObjectType()
@Entity('element_styles')
export class ElementStyleEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  elementType: string;

  @Field(() => GraphQLJSONObject)
  @Column({ type: 'jsonb' })
  styles: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  wrapperStyles?: Record<string, any>;

  @Field(() => StyleCollectionEntity)
  @ManyToOne(() => StyleCollectionEntity, (sc) => sc.elementStyles, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  collection!: StyleCollectionEntity;
}
