import { ICreateAppointment, IGetListAppointment } from '@/interfaces/appointment.interface';
import { AppointmentEntity } from '../appointment.entity';
import { EPaymentType, EService, EStatus } from '@/constants';
import { DoctorEntity } from '../doctors.entity';
import { PatientEntity } from '../patient.entity';
import { getManager } from 'typeorm';
import PaymentDetailRepo from './paymentDetail.repo';

export default class AppointmentRepo {
  public static async createAppointment({
    doctor,
    patient,
    data,
  }: {
    doctor: DoctorEntity;
    patient: PatientEntity;
    data: ICreateAppointment;
  }) {
    const appointment = new AppointmentEntity();
    appointment.doctor = doctor;
    appointment.patient = patient;
    appointment.reason = data.reason;
    appointment.scheduledTime = data.scheduledTime;
    appointment.scheduledDate = data.scheduledDate;
    appointment.status = EStatus.AWAITING_PAYMENT;
    appointment.fee = data.fee;
    appointment.service = data.service;
    appointment.patientName = data.patientName;
    appointment.patientPhone = data.patientPhone;
    appointment.patientAge = data.patientAge;
    appointment.patientGender = data.patientGender;
    appointment.paymentType =
      data.service === EService.ONLINE ? EPaymentType.ONLINE : EPaymentType.SMARTCARD;
    await AppointmentEntity.save(appointment);
    return appointment;
  }
  public static async getAppointmentById(id: string) {
    const appointment = await AppointmentEntity.findOne({
      where: { id },
      relations: ['doctor', 'patient'],
    });
    return appointment;
  }

  public static async getListAppointment({
    doctorId,
    patientId,
    filter,
    isAdmin = false,
  }: IGetListAppointment) {
    const whereConditions: any = {};

    if (doctorId) {
      whereConditions['doctor'] = doctorId;
    }

    if (patientId) {
      whereConditions['patient'] = patientId;
    }

    if (filter.scheduledDate) {
      whereConditions['scheduledDate'] = filter.scheduledDate;
    }

    if (filter.scheduledTime) {
      whereConditions['scheduledTime'] = filter.scheduledTime;
    }

    if (isAdmin) {
      whereConditions['status'] = filter.status;
    } else {
      // Giả sử chỉ bác sĩ và admin có quyền xem tất cả các status
      whereConditions['status'] = filter.status || 'COMPLETED';
    }

    const queryOptions: any = {
      where: whereConditions,
      order: { scheduledDate: 'ASC', scheduledTime: 'ASC' },
    };

    if (isAdmin) {
      queryOptions.relations = ['doctor', 'patient'];
    }

    return await AppointmentEntity.find(queryOptions);
  }

  public static async updateAppointmentStatus(appointment: AppointmentEntity, status: EStatus) {
    appointment.status = status;
    return await AppointmentEntity.save(appointment);
  }
}
