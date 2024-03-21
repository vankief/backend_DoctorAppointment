import { HttpException } from '@/helpers/exceptions/httpException';
import { Auth, DataStoredInToken } from '@/interfaces/auths.interface';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
export const createToken = (payload: {}, secretKey: Secret, expiresIn: string) => {
  return jwt.sign(payload, secretKey, { expiresIn });
};
const verifyToken = (token: string, secretKey: Secret) => {
  try {
    return jwt.verify(token, secretKey) as JwtPayload;
  } catch (error) {
    throw new HttpException(401, 'Token expired');
  }
};

export const JwtHelper = {
  verifyToken,
  createToken,
};
