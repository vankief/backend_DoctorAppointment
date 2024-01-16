import { CreateUserDto } from '@/dtos/users.dto';
import { Routes } from '@/interfaces/routes.interface';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { Router } from 'express';
import { AdminController } from '@api/controllers/admins.controller';
import asyncHandler from '@/utils/asyncHandler';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Role } from '@/constants';

export class AdminsRoute implements Routes {
  public path = '/admin';
  public router = Router();
  public admin = new AdminController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(
      `${this.path}/signup`,
      ValidationMiddleware(CreateUserDto),
      asyncHandler(this.admin.signUp),
    );
    this.router.get(
      `${this.path}/:id`,
      AuthMiddleware([Role.ADMIN]),
      asyncHandler(this.admin.getAdminById),
    );
    this.router.patch(
      `${this.path}/:id`,
      AuthMiddleware([Role.ADMIN]),
      asyncHandler(this.admin.updateAdmin),
    );
    this.router.delete(
      `${this.path}/:id`,
      AuthMiddleware([Role.ADMIN]),
      asyncHandler(this.admin.deleteAdmin),
    );
  }
}
