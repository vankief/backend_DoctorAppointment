import { CreateAppointmentDto } from '@/dtos/appointment.dto';

import { Routes } from '@/interfaces/routes.interface';

import { ValidationMiddleware } from '@/middlewares/validation.middleware';

import asyncHandler from '@/utils/asyncHandler';

import { Router } from 'express';

import { AppointmentController } from '../controllers/appointment.controller';

import { AuthMiddleware } from '@/middlewares/auth.middleware';

import { Role } from '@/constants';

export class AppointmentRoute implements Routes {
  public path = '/appointment';

  public router = Router();

  public appointmentController = new AppointmentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      AuthMiddleware([Role.PATIENT]),
      ValidationMiddleware(CreateAppointmentDto),
      asyncHandler(this.appointmentController.createAppointment),
    );

    this.router.get(`${this.path}/get`, asyncHandler(this.appointmentController.getAppointments));

    this.router.get(
      `${this.path}/get/:id`,
      asyncHandler(this.appointmentController.getAppointmentById),
    );

    this.router.delete(
      `${this.path}/delete/:id`,
      asyncHandler(this.appointmentController.deleteAppointment),
    );

    this.router.put(
      `${this.path}/update/:id`,
      AuthMiddleware([Role.DOCTOR]),
      asyncHandler(this.appointmentController.updateAppointment),
    );

    this.router.get(
      `${this.path}/:id`,
      AuthMiddleware([Role.PATIENT]),
      asyncHandler(this.appointmentController.getPatientAppointmentById),
    );
  }
}
