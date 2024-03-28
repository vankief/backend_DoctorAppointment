import { AppointmentEntity } from '@/entities/appointment.entity';
import { DoctorEntity } from '@/entities/doctors.entity';
import { PatientEntity } from '@/entities/patient.entity';
import { HttpException } from '@/helpers/exceptions/httpException';
import { ICreateAppointment, IGetAppointmentByAdmin } from '@/interfaces/appointment.interface';
import { Service } from 'typedi';
import { EntityRepository } from 'typeorm';
import { EStatus } from '@/constants';
import AppointmentRepo from '@/entities/repo/appointment.repo';
import PaymentDetailRepo from '@/entities/repo/paymentDetail.repo';
@Service()
@EntityRepository()
export class AppointmentService {
  public async createAppointment({
    patientId,
    doctorId,
    data,
  }: {
    patientId: string;
    doctorId: string;
    data: ICreateAppointment;
  }) {
    const doctor = await DoctorEntity.findOne(doctorId);
    const patient = await PatientEntity.findOne(patientId);
    if (!doctor) {
      throw new HttpException(400, 'Doctor not found');
    }
    const appointment = await AppointmentRepo.createAppointment({
      doctor,
      patient,
      data,
    });
    if (!appointment) {
      throw new HttpException(400, 'Appointment not created');
    }
    const paymentInfo = await PaymentDetailRepo.createPaymentInfo(appointment);
    return paymentInfo;
  }

  public async getAppointmentById(id: string) {
    const appointment = await AppointmentEntity.findOne({
      where: { id },
      relations: ['doctor', 'patient'],
    });
    if (!appointment) {
      throw new HttpException(400, 'Appointment not found');
    }
    return appointment;
  }
  public async updateStatus(id: string, status: EStatus) {
    const appointment = await AppointmentEntity.findOne(id);
    if (!appointment) {
      throw new HttpException(400, 'Appointment not found');
    }
    return await AppointmentEntity.update(id, { status });
  }

  public async getAppointmentByAdmin({
    doctorId,
    scheduleDate,
    scheduleTime,
    status,
  }: IGetAppointmentByAdmin) {
    const filter = {
      scheduleDate,
      scheduleTime,
      status,
    };
    return await AppointmentRepo.getListAppointment({
      doctorId,
      filter,
      isAdmin: true,
    });
  }

  public async getListAppointmentByPatient({ patientId, scheduleDate, status }) {
    const filter = {
      scheduleDate,
      status,
    };
    return await AppointmentRepo.getListAppointment({
      patientId,
      filter,
    });
  }

  public async getListAppointmentByDoctor({ doctorId, scheduleDate, status }) {
    const filter = {
      scheduleDate,
      status,
    };
    return await AppointmentRepo.getListAppointment({
      doctorId,
      filter,
    });
  }
}
