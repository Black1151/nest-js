import { Column, Entity, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AbstractBaseEntity } from 'src/common/base.entity';
import { ThemeEntity } from '../theme/theme.entity';

@ObjectType()
@Entity('component_variants')
export class ComponentVariantEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  baseComponent: string;

  @Field(() => GraphQLJSONObject)
  @Column({ type: 'jsonb' })
  props: Record<string, any>;

  @Field()
  @Column()
  accessibleName: string;

  @Field(() => ThemeEntity)
  @ManyToOne(() => ThemeEntity, (theme) => theme.componentVariants, {
    nullable: false,
  })
  @JoinColumn({ name: 'theme_id' })
  theme!: ThemeEntity;

  @Field(() => ID)
  @Column({ name: 'theme_id' })
  @RelationId((variant: ComponentVariantEntity) => variant.theme)
  themeId!: number;
}
