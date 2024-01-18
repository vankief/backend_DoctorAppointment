import { Role } from '@/constants';
import { Routes } from '@/interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import asyncHandler from '@/utils/asyncHandler';
import { Router } from 'express';
import { DoctorTimeSlotController } from '../controllers/doctorTimeSlot.controller';
import { DoctorTimeSlotDTO } from '@/dtos/doctorTimeSlot.dto';

export class DoctorTimeSlotRoute implements Routes {
  public path = '/doctorTimeSlot';
  public router = Router();
  public doctorTimeSlot = new DoctorTimeSlotController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      AuthMiddleware([Role.DOCTOR]),
      ValidationMiddleware(DoctorTimeSlotDTO, true, false, true),
      asyncHandler(this.doctorTimeSlot.createDoctorTimeSlot),
    );
    this.router.get(`${this.path}`, asyncHandler(this.doctorTimeSlot.getTimeSlots));
    this.router.get(`${this.path}/:id`, asyncHandler(this.doctorTimeSlot.getDoctorTimeSlotById));
    this.router.delete(`${this.path}/:id`, this.doctorTimeSlot.deleteDoctorTimeSlot);
    this.router.patch(
      `${this.path}/:id`,
      AuthMiddleware([Role.DOCTOR]),
      this.doctorTimeSlot.updateDoctorTimeSlot,
    );
    this.router.get(
      `${this.path}/appointment-time/:id`,
      this.doctorTimeSlot.getAppointmentTimeOfEachDoctor,
    );
  }
}
