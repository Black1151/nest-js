import { Column, Entity, ManyToOne, RelationId, JoinColumn } from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AbstractBaseEntity } from 'src/common/base.entity';
import { ThemeEntity } from '../theme/theme.entity';
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

  @Field(() => ThemeEntity)
  @ManyToOne(() => ThemeEntity, (theme) => theme.styles, { nullable: false })
  @JoinColumn({ name: 'theme_id' })
  theme!: ThemeEntity;

  @Field(() => ID)
  @Column({ name: 'theme_id' })
  @RelationId((style: StyleEntity) => style.theme)
  themeId!: number;
}
