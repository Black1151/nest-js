import { Entity, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

import { AbstractBaseEntity } from 'src/common/base.entity';
import { YearGroupEntity } from '../year-group/year-group.entity';

/**
 * Enumeration of Key Stages recognised by the platform.
 *
 * Numeric values align with the National Curriculum:
 *   3 → Key Stage 3 (Years 7–9)
 *   4 → Key Stage 4 (Years 10–11)
 *   5 → Key Stage 5 (Years 12–13)
 */
export enum ValidKeyStage {
  KS3 = 3,
  KS4 = 4,
  KS5 = 5,
}

// Expose the enum in the GraphQL schema
registerEnumType(ValidKeyStage, {
  name: 'ValidKeyStage',
  description: 'National Curriculum Key Stage (3, 4 or 5)',
});

@ObjectType()
@Entity('key_stages')
export class KeyStageEntity extends AbstractBaseEntity {
  /**
   * Numeric identifier for the Key Stage (KS3 = 3, KS4 = 4, KS5 = 5).
   */
  @Field(() => ValidKeyStage)
  @Column({
    type: 'enum',
    enum: ValidKeyStage,
  })
  stage: ValidKeyStage;

  /**
   * Human‑friendly label (e.g. "Key Stage 3").
   */
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => [YearGroupEntity])
  @OneToMany(() => YearGroupEntity, (yg) => yg.keyStage)
  yearGroups: YearGroupEntity[];
}
