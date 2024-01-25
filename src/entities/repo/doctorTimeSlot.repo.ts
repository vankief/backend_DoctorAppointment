import { IListTime } from '@/interfaces/doctors.interface.';
import { DoctorTimeSlotEntity } from '../doctorTimeSlots.entity';
import { ScheduleDay } from '../scheduleDay.entity';
import { EListTime } from '@/constants';
import { DoctorEntity } from '../doctors.entity';
import _, { forEach } from 'lodash';

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
          maximumPatient: item.maximumPatient,
        });
        return await scheduleDay.save();
      }),
    );

    const newDoctorTimeSlot = new DoctorTimeSlotEntity();
    newDoctorTimeSlot.doctor = doctor;
    newDoctorTimeSlot.day = dayString;
    newDoctorTimeSlot.listTime = scheduleDays;
    newDoctorTimeSlot.isPublic = false;

    await newDoctorTimeSlot.save();

    return newDoctorTimeSlot;
  }

  public static async updateDoctorTimeSlot(isCreate: DoctorTimeSlotEntity, listTime: IListTime[]) {
    const scheduleDays = await Promise.all(
      listTime.map(async item => {
        let scheduleDay = await ScheduleDay.findOne({
          where: {
            doctorTimeSlot: isCreate.id,
            timeSlot: EListTime[item.timeSlot],
          },
        });
        if (!scheduleDay) {
          scheduleDay = ScheduleDay.create({
            timeSlot: EListTime[item.timeSlot],
            maximumPatient: item.maximumPatient,
          });
        } else {
          scheduleDay.maximumPatient = item.maximumPatient;
        }
        return await scheduleDay.save();
      }),
    );
    isCreate.listTime = scheduleDays;
    await isCreate.save();
    return isCreate;
  }

  public static async deleteDoctorTimeSlot(id: number) {
    await ScheduleDay.createQueryBuilder()
      .delete()
      .where('doctorTimeSlotId = :id', { id })
      .execute();
    return await DoctorTimeSlotEntity.delete(id);
  }

  public static async changeDoctorTimeSlot(isPublic: boolean, id: number) {
    await DoctorTimeSlotEntity.createQueryBuilder()
      .update()
      .set({ isPublic })
      .where('id = :id', { id })
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
