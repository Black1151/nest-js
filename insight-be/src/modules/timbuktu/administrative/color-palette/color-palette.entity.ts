import { Column, Entity, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { AbstractBaseEntity } from 'src/common/base.entity';
import { StyleCollectionEntity } from '../style-collection/style-collection.entity';

@ObjectType()
export class PaletteColor {
  @Field()
  name!: string;

  @Field()
  value!: string;
}

@ObjectType()
@Entity('color_palettes')
export class ColorPaletteEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  name: string;

  @Field(() => [PaletteColor])
  @Column({ type: 'jsonb' })
  colors: PaletteColor[];

  @Field(() => StyleCollectionEntity)
  @ManyToOne(() => StyleCollectionEntity, (collection) => collection.colorPalettes, { nullable: false })
  @JoinColumn({ name: 'collection_id' })
  collection!: StyleCollectionEntity;

  @Field(() => ID)
  @Column({ name: 'collection_id' })
  @RelationId((palette: ColorPaletteEntity) => palette.collection)
  collectionId!: number;
}
