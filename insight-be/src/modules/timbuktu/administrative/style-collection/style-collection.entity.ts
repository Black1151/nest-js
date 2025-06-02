import { Column, Entity, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractBaseEntity } from 'src/common/base.entity';
import { StyleEntity } from '../style/style.entity';

@ObjectType()
@Entity('style_collections')
export class StyleCollectionEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  name: string;

  @Field(() => [StyleEntity], { nullable: true })
  @OneToMany(() => StyleEntity, (style) => style.collection)
  styles?: StyleEntity[];
}
