import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

// If you want to relate Roles directly to Users, import User:

import { AbstractBaseEntity } from 'src/common/base.entity';
import { Permission } from '../permission/permission.entity';
import { User } from 'src/user/user.model';

@ObjectType()
@Entity('roles')
export class Role extends AbstractBaseEntity {
  @Field()
  @Column({ unique: true })
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => [Permission], { nullable: true })
  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true,
    eager: false, 
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'permission_id' },
  })
  permissions?: Permission[];

  @ManyToMany(() => User, (user) => user.roles)
  users?: User[];
}
