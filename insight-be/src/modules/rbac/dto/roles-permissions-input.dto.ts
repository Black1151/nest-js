// user-permissions-input.dto.ts
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UserPermissionsInput {
  @Field()
  publicId: string;
}