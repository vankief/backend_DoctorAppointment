import { IGetListAppointment } from '@/interfaces/appointment.interface';
import { AppointmentEntity } from '../appointment.entity';
import { EStatus } from '@/constants';

export default class AppointmentRepo {
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
