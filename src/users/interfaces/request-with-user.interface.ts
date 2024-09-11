// request-with-user.interface.ts
import { Request } from 'express';
import { UserRole } from '../entities/user.entity';

export interface RequestWithUser extends Request {
  user: {
    id: number;
    fullName: string;
    phone: string;
    role: UserRole;
  };
}
