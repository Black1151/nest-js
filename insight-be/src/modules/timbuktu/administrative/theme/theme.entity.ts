import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  RelationId,
  OneToMany,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { AbstractBaseEntity } from 'src/common/base.entity';
import { ColorPaletteEntity } from '../color-palette/color-palette.entity';
import { StyleEntity } from '../style/style.entity';

@ObjectType()
@Entity('themes')
export class ThemeEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  name: string;

  @Field(() => [StyleEntity], { nullable: true })
  @OneToMany(() => StyleEntity, (style) => style.theme)
  styles?: StyleEntity[];

  @Field(() => [ColorPaletteEntity], { nullable: true })
  @OneToMany(() => ColorPaletteEntity, (palette) => palette.theme)
  colorPalettes?: ColorPaletteEntity[];

  @Field(() => ColorPaletteEntity, { nullable: true })
  @ManyToOne(() => ColorPaletteEntity, { nullable: true })
  @JoinColumn({ name: 'default_palette_id' })
  defaultPalette?: ColorPaletteEntity;

  @Field(() => ID, { nullable: true })
  @Column({ name: 'default_palette_id', nullable: true })
  @RelationId((theme: ThemeEntity) => theme.defaultPalette)
  defaultPaletteId?: number;
}
