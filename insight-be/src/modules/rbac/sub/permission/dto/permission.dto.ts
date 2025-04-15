import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PermissionGroupDto } from '../../permission-group/dto/permission-group-dto';
import { RoleDto } from '../../role/dto/role.dto';

@ObjectType()
export class PermissionDto {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [RoleDto], { nullable: true })
  roles?: RoleDto[];

  @Field(() => [PermissionGroupDto], { nullable: true })
  permissionGroups?: PermissionGroupDto[];

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
