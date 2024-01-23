import { DoctorTimeSlotEntity } from '@/entities/doctorTimeSlots.entity';
import { DoctorEntity } from '@/entities/doctors.entity';
import { HttpException } from '@/helpers/exceptions/httpException';
import { ICreateTimeSlot } from '@/interfaces/doctors.interface.';
import { Service } from 'typedi';
import { EntityRepository, getRepository } from 'typeorm';
import _ from 'lodash';
import moment from 'moment';
import { ScheduleDay } from '@/entities/scheduleDay.entity';
import { ListTime } from '@/constants';

@Service()
@EntityRepository()
export class DoctorTimeSlotService {
  public async createOrUpdateDoctorTimeSlot(data: ICreateTimeSlot) {
    const { doctorId, day, listTime, maximumPatient } = data;
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
      const newDoctorTimeSlot = DoctorTimeSlotEntity.create({
        doctor: doctor,
        day: dayString,
        maximumPatient: maximumPatient,
      });

      const scheduleDays = listTime.map(item => {
        const scheduleDay = ScheduleDay.create({
          timeSlot: ListTime[item.timeSlot],
          isPublic: item.isPublic,
          doctorTimeSlot: newDoctorTimeSlot, // Liên kết với DoctorTimeSlotEntity
        });
        return scheduleDay;
      });

      newDoctorTimeSlot.listTime = scheduleDays;

      // Lưu DoctorTimeSlotEntity và liên kết ScheduleDay
      await newDoctorTimeSlot.save();
      const doctorTimeSlotId = newDoctorTimeSlot.id;
      await this.saveScheduleDays(scheduleDays, doctorTimeSlotId);

      return newDoctorTimeSlot;
    } else {
      const listTimeInDB = isCreate.listTime;
      const differences = _.differenceWith(listTimeInDB, listTime, _.isEqual);
      if (differences.length === 0) {
        return isCreate;
      } else {
        const listTimeInDB = isCreate.listTime;
        const differences = _.differenceWith(listTimeInDB, listTime, _.isEqual);
        if (differences.length === 0) {
          return isCreate;
        } else {
          // Remove existing ScheduleDay entities
          await ScheduleDay.remove(isCreate.listTime);

          // Create and associate new ScheduleDay entities
          isCreate.listTime = listTime.map(schedule => {
            const scheduleDay = ScheduleDay.create({
              timeSlot: ListTime[schedule.timeSlot],
              isPublic: schedule.isPublic,
              doctorTimeSlot: isCreate,
            });
            return scheduleDay;
          });

          isCreate.maximumPatient = maximumPatient;
          await this.saveScheduleDays(isCreate.listTime, isCreate.id);
          // Save the DoctorTimeSlotEntity with reload option
          await DoctorTimeSlotEntity.save(isCreate, { reload: true });
          return isCreate;
        }
      }
    }
  }
  async saveScheduleDays(scheduleDays: ScheduleDay[], doctorTimeSlotId): Promise<void> {
    const scheduleDayRepository = getRepository(ScheduleDay);
    await Promise.all(
      scheduleDays.map(async scheduleDay => {
        scheduleDay.doctorTimeSlot = doctorTimeSlotId; // Đặt giá trị doctorTimeSlotId
        await scheduleDayRepository.save(scheduleDay);
      }),
    );
  }
  public async deleteDoctorTimeSlot(id: number) {
    const isCreate = DoctorTimeSlotEntity.findOne(id);
    if (!isCreate) {
      throw new HttpException(400, 'DoctorTimeSlot not found');
    } else {
      return await DoctorTimeSlotEntity.delete(id);
    }
  }
  public async changeDoctorTimeSlot(isPublic: boolean, timeSlotId: number, id: number) {
    const doctorTimeSlot = await DoctorTimeSlotEntity.findOne(id, { relations: ['listTime'] });
    if (!doctorTimeSlot) {
      throw new HttpException(400, 'DoctorTimeSlot not found');
    }
    const scheduleDayToUpdate = doctorTimeSlot.listTime.find(
      timeSlot => timeSlot.id === timeSlotId,
    );
    console.log(
      '🚀 ~ DoctorTimeSlotService ~ changeDoctorTimeSlot ~ scheduleDayToUpdate:',
      scheduleDayToUpdate,
    );
    if (scheduleDayToUpdate) {
      scheduleDayToUpdate.isPublic = isPublic;
      await scheduleDayToUpdate.save();
    } else {
      throw new HttpException(400, 'ScheduleDay not found');
    }
    return doctorTimeSlot;
  }
  public async getAllTimeSlot() {
    const doctorTimeSlots = await DoctorTimeSlotEntity.find();
    return doctorTimeSlots;
  }
  public async getAppointmentTimeOfEachDoctor(doctorId: string, filter: any) {
    const doctorTimeSlots = await DoctorTimeSlotEntity.createQueryBuilder('doctorTimeSlot')
      .leftJoinAndSelect('doctorTimeSlot.listTime', 'listTime')
      .where('doctorTimeSlot.doctor = :doctorId', { doctorId })
      .andWhere('listTime.isPublic = :isPublic', { isPublic: true })
      .getMany();
    const dayString = moment(filter.day).format('YYYY-MM-DD');
    if (filter.day) {
      const result = doctorTimeSlots.filter(item => item.day === dayString);
      return result;
    } else {
      return doctorTimeSlots;
    }
  }
  public async getMyTimeSlot(doctorId: string) {
    const doctorTimeSlots = await DoctorTimeSlotEntity.find({
      where: {
        doctor: doctorId,
      },
    });
    return doctorTimeSlots;
  }
}
