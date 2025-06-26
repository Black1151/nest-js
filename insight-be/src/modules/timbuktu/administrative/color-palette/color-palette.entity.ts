import { Column, Entity, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AbstractBaseEntity } from 'src/common/base.entity';
import { StyleCollectionEntity } from '../style-collection/style-collection.entity';

@ObjectType()
@Entity('color_palettes')
export class ColorPaletteEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  name: string;

  @Field(() => GraphQLJSONObject)
  @Column({ type: 'jsonb' })
  colors: Record<string, string>;

  @Field(() => StyleCollectionEntity)
  @ManyToOne(() => StyleCollectionEntity, (collection) => collection.colorPalettes, { nullable: false })
  @JoinColumn({ name: 'collection_id' })
  collection!: StyleCollectionEntity;

  @Field(() => ID)
  @Column({ name: 'collection_id' })
  @RelationId((palette: ColorPaletteEntity) => palette.collection)
  collectionId!: number;
}
