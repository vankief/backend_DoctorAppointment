import { Appointment } from '@/interfaces/appointment.interface';
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

  public static async getAllAppointments({ fitler, startDay, endDay }) {
    return await AppointmentEntity.find({
      relations: ['doctor', 'patient'],
    });
  }

  public static async updateAppointmentStatus(appointment: AppointmentEntity, status: EStatus) {
    appointment.status = status;
    return await AppointmentEntity.save(appointment);
  }
}
