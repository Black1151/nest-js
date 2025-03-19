// dto/roles-permissions-response.dto.ts
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RolesPermissionsResponse {
  @Field(() => [String])
  roles: string[];

  @Field(() => [String])
  permissions: string[];
}
