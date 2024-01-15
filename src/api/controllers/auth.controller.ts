import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Auth, RequestWithUser } from '@/interfaces/auths.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@api/services/auth.service';
import { OK } from '@/helpers/valid_response/success.response';

export class AuthController {
  public auth = Container.get(AuthService);
  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: Auth = req.body;
      const { tokens, findUser } = await this.auth.login(userData);
      new OK({
        message: 'login successfully',
        data: tokens,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userData: Auth = req.user;
      const logOutUserData: Auth = await this.auth.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}
