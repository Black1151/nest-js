// src/modules/user/user.entity.ts   (or user.model.ts)

import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  BeforeInsert,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';

import { AbstractBaseEntity } from 'src/common/base.entity';
import { Role } from 'src/modules/rbac/sub/role/role.entity';

import { StudentProfileEntity } from '../timbuktu/user-profiles/student-profile/student-profile.entity';
import { EducatorProfileEntity } from '../timbuktu/user-profiles/educator-profile/educator-profile.entity';

import { StudentProfileDto } from '../timbuktu/user-profiles/student-profile/dto/student-profile.dto';
import { EducatorProfileDto } from '../timbuktu/user-profiles/educator-profile/dto/educator-profile.dto';

@ObjectType() // ← exposes the class in GraphQL
@Entity('users')
export class User extends AbstractBaseEntity {
  /* ------------------------------------------------------------------ */
  /*  Basic columns                                                     */
  /* ------------------------------------------------------------------ */

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  addressLine1?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  addressLine2?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  county?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  postalCode?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  country?: string;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  dateOfBirth?: Date;

  /* ------------------------------------------------------------------ */
  /*  Auth & identity                                                   */
  /* ------------------------------------------------------------------ */

  @Field()
  @Column({ unique: true, update: false })
  publicId: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  appleId?: string;

  @Column({ nullable: true })
  microsoftId?: string;

  @Field()
  @Column()
  userType: 'student' | 'educator';

  @BeforeInsert()
  generatePublicId() {
    if (!this.publicId) this.publicId = uuidv4();
  }

  /* ------------------------------------------------------------------ */
  /*  Roles                                                             */
  /* ------------------------------------------------------------------ */

  @Field(() => [Role], { nullable: true })
  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles?: Role[];

  /* ------------------------------------------------------------------ */
  /*  Profile relations (inverse side)                                  */
  /* ------------------------------------------------------------------ */
  /*  NOTE:                                                             */
  /*  • Property types are the *entity* classes so TypeORM can hydrate. */
  /*  • @Field still exposes the DTOs so GraphQL returns clean objects. */
  /*  • No @JoinColumn here—the FK lives on the profile tables.         */

  @OneToOne(() => StudentProfileEntity, (sp) => sp.user)
  @Field(() => StudentProfileDto, { nullable: true })
  studentProfile?: StudentProfileEntity;

  @OneToOne(() => EducatorProfileEntity, (ep) => ep.user)
  @Field(() => EducatorProfileDto, { nullable: true })
  educatorProfile?: EducatorProfileEntity;
}
