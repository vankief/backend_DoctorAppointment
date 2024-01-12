import { CreateUserDto } from '@/dtos/users.dto';
import { Routes } from '@/interfaces/routes.interface';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { Router } from 'express';
import { AdminController } from '@api/controllers/admins.controller';
import asyncHandler from '@/utils/asyncHandler';

export class AdminsRoute implements Routes {
  public path = '/admin';
  public router = Router();
  public admin = new AdminController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post('/signup', ValidationMiddleware(CreateUserDto), asyncHandler(this.admin.signUp));
  }
}
