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
    } else if (isCreate.isPublic == true) {
      throw new HttpException(400, "Can't update public time slot");
    } else {
      return DoctorTimeSlotRepo.updateDoctorTimeSlot(isCreate, listTime);
    }
  }

  public async deleteDoctorTimeSlot(id: number) {
    const isCreate = await DoctorTimeSlotEntity.findOne(id);
    if (!isCreate) {
      throw new HttpException(400, 'DoctorTimeSlot not found');
    } else if (isCreate.isPublic) {
      throw new HttpException(400, "Can't delete public time slot");
    } else {
      return DoctorTimeSlotRepo.deleteDoctorTimeSlot(id);
    }
  }
  public async changeDoctorTimeSlot(isPublic: boolean, id: number) {
    const doctorTimeSlot = await DoctorTimeSlotEntity.findOne(id);
    if (!doctorTimeSlot) {
      throw new HttpException(400, 'DoctorTimeSlot not found');
    } else {
      return DoctorTimeSlotRepo.changeDoctorTimeSlot(isPublic, id);
    }
  }
  public async getDoctorTimeSlotByAdmin({
    doctorId,
    startDay,
    endDay,
    isPublic,
  }: IGetListDoctorTimeSlotStartEndDay) {
    const filter = {
      startDay: startDay,
      endDay: endDay,
      isPublic,
    };
    return DoctorTimeSlotRepo.getDoctorTimeSlot({
      doctorId,
      filter,
      isAdmin: true,
    });
  }

  /*
   * @des: get appointment time of each doctor (By PATIENT)
   */
  public async getDoctorTimeSlotByPatient({ doctorId, day }: IGetListDoctorTimeSlot) {
    const filter = {
      day: day,
      isPublic: true,
    };
    return DoctorTimeSlotRepo.getDoctorTimeSlot({
      doctorId,
      filter,
    });
  }
  public async getMyOwnTimeSlots({ doctorId, day }: IGetListDoctorTimeSlot) {
    const filter = {
      day: day,
    };
    return DoctorTimeSlotRepo.getDoctorTimeSlot({
      doctorId,
      filter,
    });
  }
}

interface IGetListDoctorTimeSlot {
  doctorId: string;
  day: string;
}

interface IGetListDoctorTimeSlotStartEndDay {
  doctorId: string;
  startDay: string;
  endDay: string;
  isPublic?: boolean;
}
