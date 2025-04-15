import { ObjectType } from 'type-graphql';
import { PermissionGroupDto } from '../../permission-group/dto/permission-group-dto';
import { PermissionDto } from '../../permission/dto/permission.dto';
import { Field, Int } from '@nestjs/graphql';
import { User } from 'src/modules/user/user.model';

/// Unused for now, still considering continuing splitting out entity/dto

@ObjectType()
export class RoleDto {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [PermissionDto], { nullable: true })
  permissions?: PermissionDto[];

  @Field(() => [PermissionGroupDto], { nullable: true })
  permissionGroups?: PermissionGroupDto[];

  @Field(() => [User], { nullable: true })
  users?: User[];

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
