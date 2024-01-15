import { Routes } from '@/interfaces/routes.interface';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import asyncHandler from '@/utils/asyncHandler';
import { Router } from 'express';
import { Role } from '@/constants';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { DoctorsController } from '../controllers/doctors.controller';
import { CreateDoctorDto } from '@/dtos/doctors.dto';

export class DoctorRouter implements Routes {
  public path = '/doctors';
  public router = Router();
  public doctors = new DoctorsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, asyncHandler(this.doctors.getDoctorById));
    this.router.post(
      `${this.path}`,
      AuthMiddleware([Role.ADMIN]),
      ValidationMiddleware(CreateDoctorDto),
      asyncHandler(this.doctors.createDoctor),
    );
    this.router.patch(
      `${this.path}/:id`,
      AuthMiddleware([Role.ADMIN]),
      asyncHandler(this.doctors.updateDoctor),
    );
    this.router.delete(
      `${this.path}/:id`,
      AuthMiddleware([Role.ADMIN]),
      asyncHandler(this.doctors.deleteDoctor),
    );
    this.router.get(`${this.path}`, asyncHandler(this.doctors.getAllDoctors));
  }
}
