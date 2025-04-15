import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PermissionDto } from '../../permission/dto/permission.dto';
import { RoleDto } from '../../role/dto/role.dto';

@ObjectType()
export class PermissionGroupDto {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [PermissionDto], { nullable: true })
  permissions?: PermissionDto[];

  @Field(() => [RoleDto], { nullable: true })
  roles?: RoleDto[];

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
