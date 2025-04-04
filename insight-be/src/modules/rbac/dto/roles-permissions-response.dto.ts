// roles-permissions-response.dto.ts

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RoleDTO {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class PermissionDTO {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class RolesPermissionsResponse {
  @Field(() => [RoleDTO])
  roles: RoleDTO[];

  @Field(() => [PermissionDTO])
  permissions: PermissionDTO[];
}
