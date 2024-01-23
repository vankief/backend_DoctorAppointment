// DoctorTimeSlotService.ts
import { getRepository } from 'typeorm';
import * as moment from 'moment';
import { DoctorEntity } from '@/entities/doctors.entity';
import { DoctorTimeSlotEntity } from './DoctorTimeSlot.entity';
import { ScheduleDay } from './ScheduleDay.entity';

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
    const doctorTimeSlot = DoctorTimeSlotEntity.create({
      doctor: doctor,
      day: dayString,
      maximumPatient: maximumPatient,
    });

    doctorTimeSlot.listTime = await Promise.all(
      listTime.map(async schedule => {
        const scheduleDay = ScheduleDay.create({
          timeSlot: schedule.timeSlot,
          isPublic: schedule.isPublic,
          doctorTimeSlotId: doctorTimeSlot.id, // Lưu chỉ doctorTimeSlotId
        });
        await scheduleDay.save(); // Lưu ScheduleDay vào cơ sở dữ liệu
        return scheduleDay;
      }),
    );

    await DoctorTimeSlotEntity.save(doctorTimeSlot); // Sử dụng save để tạo mới bản ghi

    return doctorTimeSlot;
  } else {
    const listTimeInDB = isCreate.listTime;
    const differences = _.differenceWith(listTimeInDB, listTime, _.isEqual);
    if (differences.length === 0) {
      return isCreate;
    } else {
      const updatedValues = {
        listTime: listTime,
        maximumPatient: maximumPatient,
      };
      await DoctorTimeSlotEntity.update({ id: isCreate.id }, updatedValues);
      isCreate.listTime.forEach(scheduleDay => scheduleDay.remove());
      isCreate.listTime = listTime.map(schedule => {
        const scheduleDay = ScheduleDay.create({
          timeSlot: schedule.timeSlot,
          isPublic: schedule.isPublic,
          doctorTimeSlotId: isCreate.id, // Lưu chỉ doctorTimeSlotId
        });
        return scheduleDay;
      });
      await Promise.all(isCreate.listTime.map(scheduleDay => scheduleDay.save()));
      return isCreate;
    }
  }
}
