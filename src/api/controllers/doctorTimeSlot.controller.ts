import { Container } from 'typedi';
import { DoctorTimeSlotService } from '../services/doctorTimeSlot.service';
import { Request, Response } from 'express';
import { OK } from '@/helpers/valid_response/success.response';
import {
  ICreateTimeSlot,
  IGetListDoctorTimeSlot,
  IGetListDoctorTimeSlotStartEndDay,
} from '@/interfaces/doctors.interface.';
import { RequestWithUser } from '@/interfaces/auths.interface';

export class DoctorTimeSlotController {
  public doctorTimeSlot = Container.get(DoctorTimeSlotService);

  /**
   * @desc:
   * */
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

  /**
   * @desc:
   * */
  public deleteDoctorTimeSlot = async (req: RequestWithUser, res: Response) => {
    const doctorTimeSlotId = +req.params.id;
    const result = await this.doctorTimeSlot.deleteDoctorTimeSlot(doctorTimeSlotId);
    new OK({
      message: 'DoctorTimeSlot deleted successfully',
      data: result,
    }).send(res);
  };

  /**
   * @desc:
   * */
  public changeDoctorTimeSlotStatus = async (req: RequestWithUser, res: Response) => {
    const timeSlotId = +req.params.id;
    const { isPublic } = req.body;
    const doctorTimeSlot = await this.doctorTimeSlot.changeDoctorTimeSlotStatus(
      isPublic,
      timeSlotId,
    );
    new OK({
      message: 'DoctorTimeSlot changed successfully',
      data: doctorTimeSlot,
    }).send(res);
  };

  /**
   * @desc:
   * */
  public getDoctorTimeSlotByPatient = async (req: RequestWithUser, res: Response) => {
    const doctorId = req.params.id;
    const day = req.query.day as string;
    const doctorTimeSlots = await this.doctorTimeSlot.getDoctorTimeSlotByPatient({
      doctorId,
      day,
    });
    new OK({
      message: 'DoctorTimeSlots fetched successfully',
      data: doctorTimeSlots,
    }).send(res);
  };

  /**
   * @desc:
   * */
  public getAllTimeSlot = async (req: Request, res: Response) => {
    const data = {
      doctorId: req.params.id,
      ...req.query,
    } as IGetListDoctorTimeSlotStartEndDay;
    const doctorTimeSlots = await this.doctorTimeSlot.getDoctorTimeSlotByAdmin({
      ...data,
    });
    new OK({
      message: 'DoctorTimeSlots fetched successfully',
      data: doctorTimeSlots,
    }).send(res);
  };

  /**
   * @desc:
   * */
  public getMyOwnTimeSlots = async (req: RequestWithUser, res: Response) => {
    const data = {
      doctorId: req.user.userId,
      ...req.body,
    } as IGetListDoctorTimeSlot;
    const doctorTimeSlots = await this.doctorTimeSlot.getMyOwnTimeSlots(data);
    new OK({
      message: 'DoctorTimeSlots fetched successfully',
      data: doctorTimeSlots,
    }).send(res);
  };
}
