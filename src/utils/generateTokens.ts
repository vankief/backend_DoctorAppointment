import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRES_IN,
} from '@/config';
import { JwtHelper } from './jwtHelper';

export const generateTokens = (payload: any) => {
  const accessToken = JwtHelper.createToken(payload, ACCESS_TOKEN, ACCESS_TOKEN_EXPIRES_IN);
  const refreshToken = JwtHelper.createToken(payload, REFRESH_TOKEN, REFRESH_TOKEN_EXPIRES_IN);
  return { accessToken, refreshToken };
};
