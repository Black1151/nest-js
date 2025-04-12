// update-user.dto.ts
import { InputType, OmitType } from '@nestjs/graphql';
import { CreateUserDto } from './create-user.dto';

@InputType()
export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password',
] as const) {}
