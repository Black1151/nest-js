import { Column, Entity, ManyToOne, OneToMany, RelationId, JoinColumn } from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { AbstractBaseEntity } from 'src/common/base.entity';
import { StyleEntity } from '../style/style.entity';
import { PageElementType } from '../style/page-element-type';
import { StyleCollectionEntity } from '../style-collection/style-collection.entity';

@ObjectType()
@Entity('style_groups')
export class StyleGroupEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  name: string;

  @Field(() => PageElementType)
  @Column({ type: 'enum', enum: PageElementType })
  element: PageElementType;

  @Field(() => StyleCollectionEntity)
  @ManyToOne(() => StyleCollectionEntity, (collection) => collection.styleGroups, {
    nullable: false,
  })
  @JoinColumn({ name: 'collection_id' })
  collection!: StyleCollectionEntity;

  @Field(() => ID)
  @Column({ name: 'collection_id' })
  @RelationId((group: StyleGroupEntity) => group.collection)
  collectionId!: number;

  @Field(() => [StyleEntity], { nullable: true })
  @OneToMany(() => StyleEntity, (style) => style.group)
  styles?: StyleEntity[];
}
