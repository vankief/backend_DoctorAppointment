import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import asyncHandler from '@/utils/asyncHandler';
import { PatientController } from '../controllers/patients.controller';
import { CreatePatientDto } from '@/dtos/patients.dto';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Role } from '@/constants';

export class PatientRoute implements Routes {
  public path = '/patient';
  public router = Router();
  public patient = new PatientController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/signup`,
      ValidationMiddleware(CreatePatientDto),
      asyncHandler(this.patient.signup),
    );

    this.router.get(
      `${this.path}`,
      AuthMiddleware([Role.ADMIN]),
      asyncHandler(this.patient.getAllPatients),
    );

    this.router.get(`${this.path}/:id`, asyncHandler(this.patient.getPatientById));

    this.router.delete(`${this.path}/:id`, this.patient.deletePatient);

    this.router.patch(
      `${this.path}/:id`,
      AuthMiddleware([Role.PATIENT]),
      ValidationMiddleware(CreatePatientDto, true, true),
      this.patient.updatePatient,
    );
  }
}
