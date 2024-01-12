import { Router } from 'express';
import { AuthController } from '@api/controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { LoginUserDto } from '@/dtos/authusers.dto';
import asyncHandler from '@/utils/asyncHandler';
export class AuthRoute implements Routes {
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.post('/signup', ValidationMiddleware(CreateUserDto), this.auth.signUp);
    this.router.post('/login', ValidationMiddleware(LoginUserDto), asyncHandler(this.auth.logIn));
    this.router.post('/logout', AuthMiddleware, asyncHandler(this.auth.logOut));
  }
}
