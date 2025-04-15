// user.model.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';
import { AbstractBaseEntity } from 'src/common/base.entity';
import { Role } from 'src/modules/rbac/sub/role/role.entity';
import { Entity, Column, ManyToMany, JoinTable, BeforeInsert } from 'typeorm';

/// needs to be separated into an entity and dto

@ObjectType()
@Entity('users')
export class User extends AbstractBaseEntity {
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
  @Column({
    type: 'timestamp',
    nullable: true,
  })
  dateOfBirth?: Date;

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

  @BeforeInsert()
  generatePublicId() {
    if (!this.publicId) {
      this.publicId = uuidv4();
    }
  }

  @Field(() => [Role], { nullable: true })
  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles?: Role[];
}
