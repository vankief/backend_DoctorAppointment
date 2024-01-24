import { IListTime } from '@/interfaces/doctors.interface.';
import { DoctorTimeSlotEntity } from '../doctorTimeSlots.entity';
import { ScheduleDay } from '../scheduleDay.entity';
import { EListTime } from '@/constants';
import { DoctorEntity } from '../doctors.entity';
import _ from 'lodash';

interface ICreateTimeSlotRepo {
  doctor: DoctorEntity;
  dayString: string;
  listTime: IListTime[];
}

export default class DoctorTimeSlotRepo {
  public static async createDoctorTimeSlot({ doctor, dayString, listTime }: ICreateTimeSlotRepo) {
    const scheduleDays = await Promise.all(
      listTime.map(async item => {
        const scheduleDay = ScheduleDay.create({
          timeSlot: EListTime[item.timeSlot],
          isPublic: false,
          maximumPatient: item.maximumPatient,
        });
        return await scheduleDay.save();
      }),
    );

    const newDoctorTimeSlot = new DoctorTimeSlotEntity();
    newDoctorTimeSlot.doctor = doctor;
    newDoctorTimeSlot.day = dayString;
    newDoctorTimeSlot.listTime = scheduleDays;

    await newDoctorTimeSlot.save();

    return newDoctorTimeSlot;
  }
  public static async updateDoctorTimeSlot(isCreate: DoctorTimeSlotEntity, listTime: IListTime[]) {
    const listTimeInDB = isCreate.listTime;
    const listTimeCompare = listTimeInDB.map(item => {
      return {
        timeSlot: item.timeSlot,
        isPublic: item.isPublic,
        maximumPatient: item.maximumPatient,
      };
    });
    const differences = _.differenceWith(listTimeCompare, listTime, _.isEqual);
    if (differences.length === 0) {
      return isCreate;
    } else {
      // Remove existing ScheduleDay entities
      await ScheduleDay.remove(isCreate.listTime);
      isCreate.listTime = await Promise.all(
        listTime.map(async item => {
          const scheduleDay = ScheduleDay.create({
            timeSlot: EListTime[item.timeSlot],
            isPublic: false,
            maximumPatient: item.maximumPatient,
          });

          return await scheduleDay.save();
        }),
      );
      const result = await DoctorTimeSlotEntity.save(isCreate);
      return result;
    }
  }
  public static async deleteDoctorTimeSlot(id: number) {
    await ScheduleDay.createQueryBuilder()
      .delete()
      .where('doctorTimeSlotId = :id', { id })
      .execute();
    return await DoctorTimeSlotEntity.delete(id);
  }
  public static async changeDoctorTimeSlot(isPublic: boolean, timeSlotId: number, id: number) {
    await ScheduleDay.createQueryBuilder()
      .update()
      .set({ isPublic })
      .where('id = :timeSlotId', { timeSlotId })
      .execute();
    const result = await DoctorTimeSlotEntity.findOne(id, {
      relations: ['listTime'],
    });
    return result;
  }
  public static async getAppointmentTimeOfEachDoctor(doctorId: string, filter: any) {
    const doctorTimeSlots = await DoctorTimeSlotEntity.find({
      where: {
        doctor: doctorId,
      },
      relations: ['listTime'],
    });
    if (filter.day) {
      const result = doctorTimeSlots
        .filter(item => item.day === filter.day) // Lọc theo ngày
        .map(item => {
          const listTime = item.listTime.filter(time => time.isPublic === true); // Lọc theo isPublic
          return {
            day: item.day,
            listTime,
          };
        });
      return result;
    } else {
      const result = doctorTimeSlots
        .filter(item => {
          const hasPublicTime = item.listTime.some(time => time.isPublic === true);
          return hasPublicTime;
        })
        .map(item => {
          const listTime = item.listTime.filter(time => time.isPublic === true);
          return {
            day: item.day,
            listTime,
          };
        });

      return result;
    }
  }
  public static async getMyTimeSlot(doctorId: string) {
    const doctorTimeSlots = await DoctorTimeSlotEntity.find({
      where: {
        doctor: doctorId,
      },
      relations: ['listTime'],
    });
    return doctorTimeSlots;
  }
}
