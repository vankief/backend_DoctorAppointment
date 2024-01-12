import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  userId: number;
  role: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: Auth;
}
export interface Auth {
  email: string;
  password: string;
  userId?: number;
  role?: string;
}

export interface ILoginData {
  email: string;
  password: string;
}
