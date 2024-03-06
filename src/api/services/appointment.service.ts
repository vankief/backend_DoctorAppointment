import { AppointmentEntity } from '@/entities/appointment.entity';
import { DoctorEntity } from '@/entities/doctors.entity';
import { PatientEntity } from '@/entities/patient.entity';
import { HttpException } from '@/helpers/exceptions/httpException';
import { ICreateAppointment, IGetAppointmentByAdmin } from '@/interfaces/appointment.interface';
import { Service } from 'typedi';
import { EntityRepository } from 'typeorm';
import { PaymentService } from './payment.service';
import { SmartCardService } from './smartcard.service';
import { EPaymentType, EStatus } from '@/constants';
import AppointmentRepo from '@/entities/repo/appointment.repo';
@Service()
@EntityRepository()
export class AppointmentService {
  public paymentService = new PaymentService();
  public smartCardService = new SmartCardService();

  public async createAppointment(data: ICreateAppointment) {
    const { doctorId, patientId, reason, scheduledDate, scheduledTime, paymentType } = data;
    const doctor = await DoctorEntity.findOne(doctorId);
    const patient = await PatientEntity.findOne(patientId);
    if (!doctor) {
      throw new HttpException(400, 'Doctor not found');
    }
    const appointment = new AppointmentEntity();
    appointment.doctor = doctor;
    appointment.patient = patient;
    appointment.reason = reason;
    appointment.scheduledDate = scheduledDate;
    appointment.scheduledTime = scheduledTime;
    appointment.paymentType = paymentType;
    if (paymentType === EPaymentType.ONLINE) {
      const paymentResult = await this.paymentService.makePayment(appointment);
      if (!paymentResult) {
        throw new HttpException(400, 'Payment failed');
      }
      appointment.status = EStatus.APPROVED;
    }
    if (paymentType === EPaymentType.SMARTCARD) {
      const smartCard = await this.smartCardService.getSmartCardByPatientId(patientId);
      if (!smartCard) {
        throw new HttpException(400, 'Smartcard not found');
      }
      appointment.status = EStatus.AWAITING_PAYMENT;
    }
    return await appointment.save();
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
  public async updateStatus(id: string, status: string) {
    const appointment = await AppointmentEntity.findOne(id);
    if (!appointment) {
      throw new HttpException(400, 'Appointment not found');
    }
    appointment.status = status;
    return await appointment.save();
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
