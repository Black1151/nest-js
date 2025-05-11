// src/modules/education/year-group.entity.ts
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

import { AbstractBaseEntity } from 'src/common/base.entity';
import { ClassEntity } from '../class/class.entity';
import { KeyStageEntity } from '../key-stage/key-stage.entity';
import { SubjectEntity } from '../subject/subject.entity';

/** Valid year-group labels written to the DB as strings */
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
  @ManyToOne(() => KeyStageEntity, (ks) => ks.yearGroups, { nullable: true })
  keyStage?: KeyStageEntity;

  @OneToMany(() => ClassEntity, (cls) => cls.yearGroup)
  classes?: ClassEntity[];

  /** NEW: subjects taught in this year */
  @Field(() => [SubjectEntity], { nullable: true })
  @ManyToMany(() => SubjectEntity, (s) => s.yearGroups, { nullable: true })
  @JoinTable({
    name: 'year_group_subjects',
    joinColumn: { name: 'year_group_id' },
    inverseJoinColumn: { name: 'subject_id' },
  })
  subjects?: SubjectEntity[];
}
