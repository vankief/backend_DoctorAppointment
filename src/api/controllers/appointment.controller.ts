import { OK } from '@/helpers/valid_response/success.response';
import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointment.service';
import { RequestWithUser } from '@/interfaces/auths.interface';
import { ICreateAppointment } from '@/interfaces/appointment.interface';
import { EStatus } from '@/constants';

export class AppointmentController {
  public appointment = new AppointmentService();

  public createAppointment = async (req: RequestWithUser, res: Response) => {
    const patientId = req.user.userId;
    const data = {
      ...req.body,
      patientId,
    } as ICreateAppointment;
    const appointment = await this.appointment.createAppointment(data);
    new OK({ message: 'Appointment created successfully', data: appointment }).send(res);
  };

  public getAppointments = async (req: RequestWithUser, res: Response) => {
    const appointments = await this.appointment.getAllAppointments();
    new OK({ message: 'Appointments found successfully', data: appointments }).send(res);
  };

  public getAppointmentById = async (req: RequestWithUser, res: Response) => {
    const appointment = await this.appointment.getAppointmentById(req.params.id);
    new OK({ message: 'Appointment found successfully', data: appointment }).send(res);
  };

  public deleteAppointment = async (req: RequestWithUser, res: Response) => {
    const status = EStatus.CANCELLED;
    const appointmentId = req.params.id;
    const result = await this.appointment.updateStatus(appointmentId, status);
    new OK({ message: 'Appointment deleted successfully', data: result }).send(res);
  };

  public updateAppointment = async (req: RequestWithUser, res: Response) => {
    const status = EStatus.COMPLETED;
    const appointmentId = req.params.id;
    const result = await this.appointment.updateStatus(appointmentId, status);
    new OK({ message: 'Appointment status updated successfully', data: result }).send(res);
  };

  public getPatientAppointmentById = async (req: RequestWithUser, res: Response) => {
    const patientId = req.user.userId;
    const appointment = await this.appointment.getPatientAppointmentById(patientId);
    new OK({ message: 'Appointment found successfully', data: appointment }).send(res);
  };
}
