import { Column, Entity, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { AbstractBaseEntity } from 'src/common/base.entity';
import { StyleCollectionEntity } from '../style-collection/style-collection.entity';
import { ColorPaletteEntity } from '../color-palette/color-palette.entity';

@ObjectType()
@Entity('themes')
export class ThemeEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  name: string;

  @Field(() => StyleCollectionEntity)
  @ManyToOne(() => StyleCollectionEntity, { nullable: false })
  @JoinColumn({ name: 'collection_id' })
  styleCollection!: StyleCollectionEntity;

  @Field(() => ID)
  @Column({ name: 'collection_id' })
  @RelationId((theme: ThemeEntity) => theme.styleCollection)
  styleCollectionId!: number;

  @Field(() => ColorPaletteEntity)
  @ManyToOne(() => ColorPaletteEntity, { nullable: false })
  @JoinColumn({ name: 'default_palette_id' })
  defaultPalette!: ColorPaletteEntity;

  @Field(() => ID)
  @Column({ name: 'default_palette_id' })
  @RelationId((theme: ThemeEntity) => theme.defaultPalette)
  defaultPaletteId!: number;

}
