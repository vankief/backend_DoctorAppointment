import { DoctorTimeSlotEntity } from '@/entities/doctorTimeSlots.entity';
import { DoctorEntity } from '@/entities/doctors.entity';
import { HttpException } from '@/helpers/exceptions/httpException';
import { ICreateTimeSlot } from '@/interfaces/doctors.interface.';
import { Service } from 'typedi';
import { EntityRepository } from 'typeorm';
import _ from 'lodash';
import moment from 'moment';
import DoctorTimeSlotRepo from '@/entities/repo/doctorTimeSlot.repo';

@Service()
@EntityRepository()
export class DoctorTimeSlotService {
  public async createOrUpdateDoctorTimeSlot(data: ICreateTimeSlot) {
    const { doctorId, day, listTime } = data;
    const doctor = await DoctorEntity.findOne({ id: doctorId });
    const dayString = moment(day).format('YYYY-MM-DD');
    const isCreate = await DoctorTimeSlotEntity.findOne({
      where: {
        doctor: doctorId,
        day: dayString,
      },
      relations: ['listTime'],
    });

    if (!isCreate) {
      return DoctorTimeSlotRepo.createDoctorTimeSlot({
        doctor,
        dayString,
        listTime,
      });
    } else {
      return DoctorTimeSlotRepo.updateDoctorTimeSlot(isCreate, listTime);
    }
  }

  public async deleteDoctorTimeSlot(id: number) {
    const isCreate = await DoctorTimeSlotEntity.findOne(id);
    if (!isCreate) {
      throw new HttpException(400, 'DoctorTimeSlot not found');
    } else {
      return DoctorTimeSlotRepo.deleteDoctorTimeSlot(id);
    }
  }
  public async changeDoctorTimeSlot(isPublic: boolean, timeSlotId: number, id: number) {
    const doctorTimeSlot = await DoctorTimeSlotEntity.findOne(id);
    if (!doctorTimeSlot) {
      throw new HttpException(400, 'DoctorTimeSlot not found');
    } else {
      return DoctorTimeSlotRepo.changeDoctorTimeSlot(isPublic, timeSlotId, id);
    }
  }
  public async getAllTimeSlot() {
    const doctorTimeSlots = await DoctorTimeSlotEntity.find({
      relations: ['listTime', 'doctor'],
    });
    return doctorTimeSlots;
  }
  public async getAppointmentTimeOfEachDoctor(doctorId: string, filter: any) {
    return DoctorTimeSlotRepo.getAppointmentTimeOfEachDoctor(doctorId, filter);
  }
  public async getMyTimeSlot(doctorId: string) {
    return DoctorTimeSlotRepo.getMyTimeSlot(doctorId);
  }
}
