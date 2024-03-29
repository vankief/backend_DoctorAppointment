import { IListTime } from '@/interfaces/doctors.interface.';
import { DoctorTimeSlotEntity } from '../doctorTimeSlots.entity';
import { ScheduleDayEntity } from '../scheduleDay.entity';
import { EListTime, Service } from '@/constants';
import { DoctorEntity } from '../doctors.entity';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

interface ICreateTimeSlotRepo {
  doctor: DoctorEntity;
  dayString: string;
  listTime: IListTime[];
}

interface IGetListDoctorTimeSlot {
  doctorId: string;
  filter: {
    day?: string;
    startDay?: string;
    endDay?: string;
    isPublic?: boolean;
  };
  isAdmin?: boolean;
}

export default class DoctorTimeSlotRepo {
  public static async createDoctorTimeSlot({ doctor, dayString, listTime }: ICreateTimeSlotRepo) {
    const scheduleDays = await Promise.all(
      listTime.map(async item => {
        const scheduleDay = ScheduleDayEntity.create({
          service: Service[item.service],
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

  public static async updateDoctorTimeSlot(
    doctorTimeSlot: DoctorTimeSlotEntity,
    listTime: IListTime[],
  ) {
    await ScheduleDayEntity.createQueryBuilder()
      .delete()
      .where('doctorTimeSlotId = :id', { id: doctorTimeSlot.id })
      .execute();

    // Tạo mới dữ liệu trong ScheduleDay
    const scheduleDays = await Promise.all(
      listTime.map(async item => {
        const scheduleDay = ScheduleDayEntity.create({
          service: Service[item.service],
          timeSlot: EListTime[item.timeSlot],
          maximumPatient: item.maximumPatient,
        });
        return await scheduleDay.save();
      }),
    );
    doctorTimeSlot.listTime = scheduleDays;
    await doctorTimeSlot.save();

    return doctorTimeSlot;
  }

  public static async deleteDoctorTimeSlot(id: number) {
    await ScheduleDayEntity.createQueryBuilder()
      .delete()
      .where('doctorTimeSlotId = :id', { id })
      .execute();
    return await DoctorTimeSlotEntity.delete(id);
  }

  public static async changeDoctorTimeSlotStatus(isPublic: boolean, id: number) {
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

  public static async getDoctorTimeSlot({
    doctorId,
    filter,
    isAdmin = false,
  }: IGetListDoctorTimeSlot) {
    const whereConditions = {
      doctor: doctorId,
    };
    const relations = ['listTime'];
    if (filter.day && !filter.endDay && !filter.startDay) {
      whereConditions['day'] = filter.day;
    }
    if (filter.startDay) {
      whereConditions['day'] = MoreThanOrEqual(filter.startDay);
    }

    if (filter.endDay) {
      whereConditions['day'] = LessThanOrEqual(filter.endDay);
    }

    if (filter.isPublic !== undefined) {
      whereConditions['isPublic'] = filter.isPublic;
    }

    if (isAdmin) {
      relations.push('doctor');
    }
    return await DoctorTimeSlotEntity.find({
      where: whereConditions,
      relations: relations,
      order: { day: 'ASC' },
    });
  }
}
