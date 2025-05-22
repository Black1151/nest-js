// src/modules/education/lesson.entity.ts
import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  RelationId,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

import { AbstractBaseEntity } from 'src/common/base.entity';
import { EducatorProfileEntity } from '../../user-profiles/educator-profile/educator-profile.entity';
import { YearGroupEntity } from '../year-group/year-group.entity';
import { TopicEntity } from '../topic/topic.entity';
import { EducatorProfileDto } from '../../user-profiles/educator-profile/dto/educator-profile.dto';

@ObjectType()
@Entity('lessons')
export class LessonEntity extends AbstractBaseEntity {
  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  content?: string;

  /* ---------- relationships ---------- */

  @Field(() => TopicEntity, { nullable: true })
  @ManyToOne(() => TopicEntity, (topic) => topic.lessons, { nullable: true })
  topic?: TopicEntity;

  @Field(() => [YearGroupEntity], { nullable: true })
  @ManyToMany(() => YearGroupEntity, { nullable: true })
  @JoinTable({
    name: 'lesson_year_groups',
    joinColumn: { name: 'lesson_id' },
    inverseJoinColumn: { name: 'year_group_id' },
  })
  recommendedYearGroups?: YearGroupEntity[];

  /** The educator who authored the lesson */
  @Field(() => EducatorProfileDto, { nullable: true })
  @ManyToOne(() => EducatorProfileEntity, { nullable: true })
  createdBy?: EducatorProfileEntity;

  /** Convenience ID field (avoids eager-loading the profile when not needed) */
  @Field(() => ID, { nullable: true })
  @RelationId((lesson: LessonEntity) => lesson.createdBy)
  createdById?: number;
}
