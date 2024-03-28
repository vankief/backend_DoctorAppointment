import { OK } from '@/helpers/valid_response/success.response';
import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointment.service';
import { RequestWithUser } from '@/interfaces/auths.interface';
import { EStatus } from '@/constants';

export class AppointmentController {
  public appointment = new AppointmentService();

  public createAppointment = async (req: RequestWithUser, res: Response) => {
    const patientId = req.user.userId;
    const { doctorId, ...data } = req.body;
    const paymentData = await this.appointment.createAppointment({ patientId, doctorId, data });
    new OK({ message: 'Appointment created successfully', data: paymentData }).send(res);
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

  public getAppointmentById = async (req: Request, res: Response) => {
    const appointmentId = req.params.id;
    const appointment = await this.appointment.getAppointmentById(appointmentId);
    new OK({ message: 'Appointment details', data: appointment }).send(res);
  };

  public getAppointmentsByPatient = async (req: RequestWithUser, res: Response) => {
    const patientId = req.user.userId;
    const scheduleDate = req.params.scheduleDate;
    const status = req.query.status;
    const appointments = await this.appointment.getListAppointmentByPatient({
      patientId,
      scheduleDate,
      status,
    });
    new OK({ message: 'Appointments', data: appointments }).send(res);
  };

  public getAppointmentsByDoctor = async (req: RequestWithUser, res: Response) => {
    const doctorId = req.user.userId;
    const scheduleDate = req.params.scheduleDate;
    const status = req.query.status;
    const appointments = await this.appointment.getListAppointmentByDoctor({
      doctorId,
      scheduleDate,
      status,
    });
    new OK({ message: 'Appointments', data: appointments }).send(res);
  };

  public getAppointmentsByAdmin = async (req: RequestWithUser, res: Response) => {
    const doctorId = req.params.doctorId;
    const scheduleDate = req.params.scheduleDate;
    const scheduleTime = req.query.scheduleTime as string;
    const status = req.query.status as string;
    const appointments = await this.appointment.getAppointmentByAdmin({
      doctorId,
      scheduleDate,
      scheduleTime,
      status,
    });
    new OK({ message: 'Appointments', data: appointments }).send(res);
  };
}
