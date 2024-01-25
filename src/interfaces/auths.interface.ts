import { Request } from 'express';
import { Role } from '@/constants';

export interface DataStoredInToken {
  userId: string;
  role: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface RequestWithUser extends Request {
  req: DataStoredInToken;
  user: Auth;
}
export interface Auth {
  email: string;
  password: string;
  userId?: string;
  role?: Role;
}

export interface ILoginData {
  email: string;
  password: string;
}
export type IGenericResponse<T> = {
  meta: {
    page: number | undefined;
    limit: number | undefined;
    total: number | undefined;
  };
  data: T;
};
