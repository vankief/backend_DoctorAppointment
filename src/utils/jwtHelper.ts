import { Auth, DataStoredInToken } from '@/interfaces/auths.interface';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
export const createToken = (payload: {}, secretKey: Secret, expiresIn: string) => {
  return jwt.sign(payload, secretKey, { expiresIn });
};
const verifyToken = (token: string, secretKey: Secret) => {
  return jwt.verify(token, secretKey) as JwtPayload;
};

export const JwtHelper = {
  verifyToken,
  createToken,
};
