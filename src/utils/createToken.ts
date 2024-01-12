import { Auth, DataStoredInToken } from '@/interfaces/auth.interface';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { ACCESS_TOKEN, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN, REFRESH_TOKEN_EXPIRES_IN } from '@/config';
const createToken = (payload: {}, secretKey: Secret, expiresIn: string) => {
  return jwt.sign(payload, secretKey, { expiresIn });
};
const verifyToken = (token: string, secretKey: Secret) => {
  return jwt.verify(token, secretKey) as JwtPayload;
};

const generateTokens = (payload: any) => {
  const accessToken = createToken(payload, ACCESS_TOKEN, ACCESS_TOKEN_EXPIRES_IN);
  const refreshToken = createToken(payload, REFRESH_TOKEN, REFRESH_TOKEN_EXPIRES_IN);
  return { accessToken, refreshToken };
};

export { createToken, generateTokens };
