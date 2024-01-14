import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@config';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@/exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@/interfaces/auths.interface';
import { JwtHelper } from '@/utils/jwtHelper';
import { AuthEntity } from '@/entities/auths.entity';
import { Role } from '@/constants';
import { AdminEntity } from '@/entities/admins.entity';

const getAuthorization = req => {
  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = (roles: string[]) => async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const token = getAuthorization(req);
    if (!token) throw new HttpException(401, 'Token not found');
    const verifiedUser = JwtHelper.verifyToken(token, ACCESS_TOKEN) as DataStoredInToken;
    const findUser = await AuthEntity.findOne({ where: { userId: verifiedUser.userId } });
    if (!findUser) throw new HttpException(401, 'Wrong authentication token');
    if (!roles.includes(findUser.role)) throw new HttpException(401, 'Wrong authentication token');
    req.user = findUser;
    next();
  } catch (error) {
    next(error);
  }
};
