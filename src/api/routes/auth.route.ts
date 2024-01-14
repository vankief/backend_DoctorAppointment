import { Router } from 'express';
import { AuthController } from '@api/controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { LoginUserDto } from '@/dtos/authusers.dto';
import asyncHandler from '@/utils/asyncHandler';
import { Role } from '@/constants';
export class AuthRoute implements Routes {
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/login', ValidationMiddleware(LoginUserDto), asyncHandler(this.auth.logIn));
    this.router.post('/logout', AuthMiddleware([Role.ADMIN]), asyncHandler(this.auth.logOut));
  }
}
