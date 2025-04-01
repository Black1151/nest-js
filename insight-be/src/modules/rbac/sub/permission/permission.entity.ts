// permission.entity.ts

import { Column, Entity, ManyToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import { Role } from '../role/role.entity';
import { AbstractBaseEntity } from 'src/common/base.entity';
import { PermissionGroup } from '../permission-group/permission-group.entity';

@ObjectType()
@Entity('permissions')
export class Permission extends AbstractBaseEntity {
  @Field()
  @Column({ unique: true })
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => [Role], { nullable: true })
  @ManyToMany(() => Role, (role) => role.permissions)
  roles?: Role[];

  @Field(() => [PermissionGroup], { nullable: true })
  @ManyToMany(() => PermissionGroup, (group) => group.permissions)
  permissionGroups?: PermissionGroup[];
}
