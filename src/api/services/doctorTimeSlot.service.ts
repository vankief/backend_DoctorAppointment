import { DoctorTimeSlotEntity } from '@/entities/doctorTimeSlots.entity';
import { DoctorEntity } from '@/entities/doctors.entity';
import { HttpException } from '@/helpers/exceptions/httpException';
import { ICreateTimeSlot, IUpdateTimeSlot } from '@/interfaces/doctors.interface.';
import { Service } from 'typedi';
import { Entity, EntityRepository } from 'typeorm';

@Service()
@EntityRepository()
export class DoctorTimeSlotService {
  public createDoctorTimeSlot = async (data: ICreateTimeSlot) => {
    const { doctorId, day, timeSlot, maximumPatient } = data;
    const doctor = await DoctorEntity.findOne({ where: { id: doctorId } });
    const dayCreated = DoctorTimeSlotEntity.findOne({ where: { day: day, doctor: doctorId } });
    if (dayCreated) {
      throw new HttpException(400, 'Day is existed');
    }
    const doctorTimeSlot = DoctorTimeSlotEntity.create({
      doctor: doctor,
      day: day,
      timeSlot: timeSlot.map((item: any) => ({
        startTime: item.startTime,
        endTime: item.endTime,
      })),
      maximumPatient: maximumPatient,
    });
    await doctorTimeSlot.save();
    return doctorTimeSlot;
  };
  public updateDoctorTimeSlot = async (
    doctorId: string,
    doctorTimeSlotId: number,
    payload: IUpdateTimeSlot,
  ) => {
    const { day, timeSlotToAdd, maximumPatient } = payload;

    const doctor = await DoctorEntity.findOne({ where: { id: doctorId } });

    // Tìm DoctorTimeSlot cho ngày và bác sĩ này
    let doctorTimeSlot = await DoctorTimeSlotEntity.findOne({
      where: { id: doctorTimeSlotId, doctor },
      relations: ['timeSlot'],
    });

    if (!doctorTimeSlot) {
      // Nếu không tìm thấy, tạo mới
      doctorTimeSlot = DoctorTimeSlotEntity.create({
        doctor,
        day,
        timeSlot: [],
      });
    }

    // Nếu đã có khoảng thời gian, kiểm tra và thực hiện cập nhật
    if (doctorTimeSlot.timeSlot) {
      timeSlotToAdd.forEach(newSlot => {
        const existingSlotIndex = doctorTimeSlot.timeSlot.findIndex(existingSlot => {
          return (
            existingSlot.startTime === newSlot.startTime && existingSlot.endTime === newSlot.endTime
          );
        });

        if (existingSlotIndex !== -1) {
          // Nếu đã có, cập nhật thông tin của khoảng thời gian
          doctorTimeSlot.timeSlot[existingSlotIndex] = newSlot;
        } else {
          // Nếu chưa có, thêm mới vào danh sách timeSlot
          doctorTimeSlot.timeSlot.push(newSlot);
        }
      });
    } else {
      // Nếu chưa có khoảng thời gian, tạo mới
      doctorTimeSlot.timeSlot = timeSlotToAdd.map((item: any) => ({
        startTime: item.startTime,
        endTime: item.endTime,
      }));
    }

    // Cập nhật thông tin khác
    doctorTimeSlot.day = day;
    doctorTimeSlot.maximumPatient = maximumPatient;

    // Lưu vào CSDL
    await DoctorTimeSlotEntity.save(doctorTimeSlot);

    return doctorTimeSlot;
  };
  public deleteDoctorTimeSlot = async (doctorTimeSlotId: number) => {
    const doctorTimeSlot = await DoctorTimeSlotEntity.findOne({
      where: { id: doctorTimeSlotId },
    });
    if (!doctorTimeSlot) {
      throw new HttpException(400, 'DoctorTimeSlot is not existed');
    }
    await doctorTimeSlot.remove();
    return doctorTimeSlot;
  };
}
