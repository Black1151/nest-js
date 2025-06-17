import { Column, Entity, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { AbstractBaseEntity } from 'src/common/base.entity';
import { ThemeEntity } from '../theme/theme.entity';

@ObjectType()
@Entity('color_palettes')
export class ColorPaletteEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  name: string;

  @Field(() => [String])
  @Column({ type: 'jsonb' })
  colors: string[];

  @Field(() => ThemeEntity)
  @ManyToOne(() => ThemeEntity, (theme) => theme.colorPalettes, { nullable: false })
  @JoinColumn({ name: 'theme_id' })
  theme!: ThemeEntity;

  @Field(() => ID)
  @Column({ name: 'theme_id' })
  @RelationId((palette: ColorPaletteEntity) => palette.theme)
  themeId!: number;
}
