import { IListTime } from '@/interfaces/doctors.interface.';
import { DoctorTimeSlotEntity } from '../doctorTimeSlots.entity';
import { ScheduleDay } from '../scheduleDay.entity';
import { ListTime } from '@/constants';
import { DoctorEntity } from '../doctors.entity';

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
          timeSlot: ListTime[item.timeSlot],
          isPublic: false,
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
}
