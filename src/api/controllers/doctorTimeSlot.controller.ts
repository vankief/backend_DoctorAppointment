import { Container } from 'typedi';
import { DoctorTimeSlotService } from '../services/doctorTimeSlot.service';
import { Request, Response } from 'express';
import { OK } from '@/helpers/valid_response/success.response';
import { ICreateTimeSlot } from '@/interfaces/doctors.interface.';
import { RequestWithUser } from '@/interfaces/auths.interface';

export class DoctorTimeSlotController {
  public doctorTimeSlot = Container.get(DoctorTimeSlotService);
  public createDoctorTimeSlot = async (req: RequestWithUser, res: Response) => {
    const data = {
      doctorId: req.user.userId,
      ...req.body,
    } as ICreateTimeSlot;
    const doctorTimeSlot = await this.doctorTimeSlot.createDoctorTimeSlot(data);
    new OK({
      message: 'DoctorTimeSlot created successfully',
      data: doctorTimeSlot,
    }).send(res);
  };
  public updateDoctorTimeSlot = async (req: RequestWithUser, res: Response) => {
    const doctorId = req.user.userId;
    const doctorTimeSlotId = req.params.id;
    const payload = req.body;
    const result = await this.doctorTimeSlot.updateDoctorTimeSlot(doctorId, day, payload);
    new OK({
      message: 'DoctorTimeSlot updated successfully',
      data: doctorTimeSlot,
    }).send(res);
  };
  public deleteDoctorTimeSlot = async (req: Request, res: Response) => {
    const result = await this.doctorTimeSlot.deleteDoctorTimeSlot(req.params.id);
    new OK({
      message: 'DoctorTimeSlot deleted successfully',
      data: result,
    }).send(res);
  };
  public getDoctorTimeSlotById = async (req: Request, res: Response) => {
    const doctorTimeSlot = await this.doctorTimeSlot.getDoctorTimeSlotById(req.params.id);
    new OK({
      message: 'DoctorTimeSlot fetched successfully',
      data: doctorTimeSlot,
    }).send(res);
  };
  public getTimeSlots = async (req: Request, res: Response) => {
    const doctorTimeSlots = await this.doctorTimeSlot.getTimeSlots();
    new OK({
      message: 'DoctorTimeSlots fetched successfully',
      data: doctorTimeSlots,
    }).send(res);
  };
  public getAppointmentTimeOfEachDoctor = async (req: Request, res: Response) => {
    const doctorTimeSlots = await this.doctorTimeSlot.getAppointmentTimeOfEachDoctor(req.params.id);
    new OK({
      message: 'DoctorTimeSlots fetched successfully',
      data: doctorTimeSlots,
    }).send(res);
  };
}
