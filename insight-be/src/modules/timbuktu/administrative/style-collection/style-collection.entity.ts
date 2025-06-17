import { Column, Entity, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractBaseEntity } from 'src/common/base.entity';
import { StyleGroupEntity } from '../style-group/style-group.entity';
import { ColorPaletteEntity } from '../color-palette/color-palette.entity';

@ObjectType()
@Entity('style_collections')
export class StyleCollectionEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  name: string;

  @Field(() => [StyleGroupEntity], { nullable: true })
  @OneToMany(() => StyleGroupEntity, (group) => group.collection)
  styleGroups?: StyleGroupEntity[];

  @Field(() => [ColorPaletteEntity], { nullable: true })
  @OneToMany(() => ColorPaletteEntity, (palette) => palette.collection)
  colorPalettes?: ColorPaletteEntity[];
}
