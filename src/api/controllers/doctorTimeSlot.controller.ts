import { Container } from 'typedi';
import { DoctorTimeSlotService } from '../services/doctorTimeSlot.service';
import { Request, Response } from 'express';
import { OK } from '@/helpers/valid_response/success.response';
import { ICreateTimeSlot } from '@/interfaces/doctors.interface.';
import { RequestWithUser } from '@/interfaces/auths.interface';

export class DoctorTimeSlotController {
  public doctorTimeSlot = Container.get(DoctorTimeSlotService);
  public createOrUpdateDoctorTimeSlot = async (req: RequestWithUser, res: Response) => {
    const data = {
      doctorId: req.user.userId,
      ...req.body,
    } as ICreateTimeSlot;
    const doctorTimeSlot = await this.doctorTimeSlot.createOrUpdateDoctorTimeSlot(data);
    new OK({
      message: 'DoctorTimeSlot created successfully',
      data: doctorTimeSlot,
    }).send(res);
  };
  public deleteDoctorTimeSlot = async (req: RequestWithUser, res: Response) => {
    const result = await this.doctorTimeSlot.deleteDoctorTimeSlot(Number(req.params.id));
    new OK({
      message: 'DoctorTimeSlot deleted successfully',
      data: result,
    }).send(res);
  };
  public changeDoctorTimeSlot = async (req: RequestWithUser, res: Response) => {
    const timeSlotId = req.query.timeSlotId;
    const { isPublic } = req.body;
    const doctorTimeSlot = await this.doctorTimeSlot.changeDoctorTimeSlot(
      isPublic,
      Number(timeSlotId),
      Number(req.params.id),
    );
    new OK({
      message: 'DoctorTimeSlot changed successfully',
      data: doctorTimeSlot,
    }).send(res);
  };
  public getAppointmentTimeOfEachDoctor = async (req: RequestWithUser, res: Response) => {
    const doctorId = req.params.id;
    const filter = req.body;
    const doctorTimeSlots = await this.doctorTimeSlot.getAppointmentTimeOfEachDoctor(
      doctorId,
      filter,
    );
    new OK({
      message: 'DoctorTimeSlots fetched successfully',
      data: doctorTimeSlots,
    }).send(res);
  };
  public getAllTimeSlot = async (req: Request, res: Response) => {
    const doctorTimeSlots = await this.doctorTimeSlot.getAllTimeSlot();
    new OK({
      message: 'DoctorTimeSlots fetched successfully',
      data: doctorTimeSlots,
    }).send(res);
  };
  public getMyTimeSlot = async (req: RequestWithUser, res: Response) => {
    const doctorId = req.user.userId;
    const doctorTimeSlots = await this.doctorTimeSlot.getMyTimeSlot(doctorId);
    new OK({
      message: 'DoctorTimeSlots fetched successfully',
      data: doctorTimeSlots,
    }).send(res);
  };
}
