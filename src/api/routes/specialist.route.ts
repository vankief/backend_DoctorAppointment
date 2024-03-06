import { Routes } from '@/interfaces/routes.interface';
import asyncHandler from '@/utils/asyncHandler';
import { Router } from 'express';
import { Role } from '@/constants';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { SpecialistController } from '../controllers/specialist.controller';

export class SpecialistRouter implements Routes {
  public path = '/specialists';
  public router = Router();
  public specialists = new SpecialistController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, asyncHandler(this.specialists.getSpecialistById));

    this.router.post(
      `${this.path}`,
      AuthMiddleware([Role.ADMIN]),
      asyncHandler(this.specialists.createSpecialist),
    );

    this.router.patch(
      `${this.path}/:id`,
      AuthMiddleware([Role.ADMIN]),
      asyncHandler(this.specialists.updateSpecialist),
    );

    this.router.delete(
      `${this.path}/:id`,
      AuthMiddleware([Role.ADMIN]),
      asyncHandler(this.specialists.deleteSpecialist),
    );

    this.router.get(`${this.path}`, asyncHandler(this.specialists.getAllSpecialists));
  }
}
