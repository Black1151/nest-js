// ────────────────────────────────────────────────────────────────────────────
// src/modules/education/year-group.entity.ts
// ────────────────────────────────────────────────────────────────────────────
import { Entity, Column, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

import { AbstractBaseEntity } from 'src/common/base.entity';
import { ClassEntity } from '../class/class.entity';
import { KeyStageEntity } from '../key-stage/key-stage.entity';
import { SubjectEntity } from '../subject/subject.entity';
import { TopicEntity } from '../topic/topic.entity';

export enum ValidYear {
  Year7 = 'Year 7',
  Year8 = 'Year 8',
  Year9 = 'Year 9',
  Year10 = 'Year 10',
  Year11 = 'Year 11',
  Year12 = 'Year 12',
  Year13 = 'Year 13',
}
registerEnumType(ValidYear, { name: 'ValidYear' });

@ObjectType()
@Entity('year_groups')
export class YearGroupEntity extends AbstractBaseEntity {
  @Field(() => ValidYear)
  @Column({ type: 'enum', enum: ValidYear })
  year: ValidYear;

  /* ---------- relationships ---------- */

  @Field(() => KeyStageEntity, { nullable: true })
  @ManyToOne(() => KeyStageEntity, (ks) => ks.yearGroups, { nullable: false })
  keyStage?: KeyStageEntity;

  @OneToMany(() => ClassEntity, (cls) => cls.yearGroup)
  classes?: ClassEntity[];

  @Field(() => [TopicEntity], { nullable: true })
  @OneToMany(() => TopicEntity, (topic) => topic.yearGroup)
  topics?: TopicEntity[];

  @Field(() => [SubjectEntity], { nullable: true })
  @ManyToMany(() => SubjectEntity, (s) => s.yearGroups, { nullable: true })
  subjects?: SubjectEntity[];
}
