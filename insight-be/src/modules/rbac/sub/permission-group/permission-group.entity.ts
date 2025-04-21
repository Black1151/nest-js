import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import { AbstractBaseEntity } from 'src/common/base.entity';
import { Permission } from '../permission/permission.entity';
import { Role } from '../role/role.entity';

@ObjectType()
@Entity('permission_groups')
export class PermissionGroup extends AbstractBaseEntity {
  @Field()
  @Column({ unique: true })
  name: string;

  @Field()
  @Column()
  description: string;

  /**
   * Many-to-many relationship with Permission.
   * We store these links in a join table: "permission_group_permissions"
   */
  @Field(() => [Permission], { nullable: true })
  @ManyToMany(() => Permission, (permission) => permission.permissionGroups, {
    cascade: true,
    eager: false,
  })
  @JoinTable({
    name: 'permission_group_permissions',
    joinColumn: { name: 'permission_group_id' },
    inverseJoinColumn: { name: 'permission_id' },
  })
  permissions?: Permission[];

  /**
   * Many-to-many relationship with Role (for convenience).
   * This allows roles to directly link to permission groups.
   */
  @Field(() => [Role], { nullable: true })
  @ManyToMany(() => Role, (role) => role.permissionGroups)
  roles?: Role[];
}
