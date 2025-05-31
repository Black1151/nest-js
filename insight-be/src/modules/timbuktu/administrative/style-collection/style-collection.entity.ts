import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { AbstractBaseEntity } from 'src/common/base.entity';
import { User } from 'src/modules/user/user.model';
import { ElementStyleEntity } from '../element-style/element-style.entity';

@ObjectType()
@Entity('style_collections')
export class StyleCollectionEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: true })
  owner?: User;

  @Field(() => [ElementStyleEntity], { nullable: true })
  @OneToMany(() => ElementStyleEntity, (es) => es.collection)
  elementStyles?: ElementStyleEntity[];
}
