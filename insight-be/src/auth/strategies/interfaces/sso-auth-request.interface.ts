// sso-auth-request.interface.ts
import { Request } from 'express';
import { User } from 'src/user/user.model';

export interface SSOAuthRequest extends Request {
  user?: User;
}
