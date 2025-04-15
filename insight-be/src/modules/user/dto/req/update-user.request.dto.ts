// update-user.dto.ts
import { InputType, OmitType } from '@nestjs/graphql';
import { CreateUserRequestDto } from './create-user.request.dto';

@InputType()
export class UpdateUserRequestDto extends OmitType(CreateUserRequestDto, [
  'password',
] as const) {}
