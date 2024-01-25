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
      `${this.path}/subscribe`,
      AuthMiddleware([Role.DOCTOR]),
      ValidationMiddleware(DoctorTimeSlotDTO, true, false, true),
      asyncHandler(this.doctorTimeSlot.createOrUpdateDoctorTimeSlot),
    );
    this.router.delete(
      `${this.path}/:id`,
      AuthMiddleware([Role.DOCTOR]),
      asyncHandler(this.doctorTimeSlot.deleteDoctorTimeSlot),
    );
    this.router.post(
      `${this.path}/change-status/:id`,
      AuthMiddleware([Role.ADMIN]),
      asyncHandler(this.doctorTimeSlot.changeDoctorTimeSlotStatus),
    );
    this.router.get(
      `${this.path}/all/:id`,
      AuthMiddleware([Role.ADMIN]),
      asyncHandler(this.doctorTimeSlot.getAllTimeSlot),
    );
    this.router.get(
      `${this.path}/appointment-time/:id`,
      asyncHandler(this.doctorTimeSlot.getDoctorTimeSlotByPatient),
    );
    this.router.get(
      `${this.path}/`,
      AuthMiddleware([Role.DOCTOR]),
      asyncHandler(this.doctorTimeSlot.getMyOwnTimeSlots),
    );
  }
}
