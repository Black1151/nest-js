// api-permission-mapping.entity.ts
import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from '../permission/permission.entity';
import { AbstractBaseEntity } from 'src/common/base.entity';

@Entity('api_permission_mapping')
export class ApiPermissionMapping extends AbstractBaseEntity {
  @Column()
  routeKey: string;

  @ManyToMany(() => Permission, { eager: true })
  @JoinTable({
    name: 'api_permission_mapping_to_permissions',
    joinColumn: { name: 'mapping_id' },
    inverseJoinColumn: { name: 'permission_id' },
  })
  requiredPermissions: Permission[];
}
