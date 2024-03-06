import { Role } from '@/constants';
import { AuthEntity } from '@/entities/auths.entity';
import { DoctorEntity } from '@/entities/doctors.entity';
import { SpecialistEntity } from '@/entities/specialist.entity';
import { HttpException } from '@/helpers/exceptions/httpException';
import { IGenericResponse } from '@/interfaces/auths.interface';
import {
  Doctor,
  DoctorSearchableFields,
  ICreateDoctor,
  IDoctorFilters,
  IUpdateDoctor,
} from '@/interfaces/doctors.interface.';
import { convertDate } from '@/utils';
import calculatePagination, { IOption } from '@/utils/paginationHelper';
import { unPick } from '@/utils/pick';
import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { EntityManager, EntityRepository, Repository, getManager } from 'typeorm';

@Service()
@EntityRepository()
export class DoctorsService extends Repository<DoctorEntity> {
  public async createDoctor(payload: ICreateDoctor) {
    const entityManager = getManager();
    const authRepository = entityManager.getRepository(AuthEntity);

    const specialist = await SpecialistEntity.findOne(payload.specialistId);
    if (!specialist) throw new HttpException(409, "Specialist doesn't exist");

    const newPayload = {
      ...payload,
      services: JSON.stringify(payload.services),
      degree: JSON.stringify(payload.degree),
      college: JSON.stringify(payload.college),
      experience: JSON.stringify(payload.experience),
      designation: JSON.stringify(payload.designation),
      awards: JSON.stringify(payload.awards),
      specialist,
    };
    const doctor = await entityManager.transaction(
      async transactionalEntityManager =>
        await transactionalEntityManager.getRepository(DoctorEntity).save(newPayload),
    );
    //moment(a, 'DD-MM-YYYY');
    const password = convertDate(new Date(payload.dob));
    if (doctor) {
      await authRepository.save({
        email: doctor.email,
        password: await hash(password, 10),
        userId: doctor.id,
        role: Role.DOCTOR,
      });
    }
    return doctor;
  }

  public async updateDoctor(id: string, payload: IUpdateDoctor) {
    const doctor = await DoctorEntity.findOne(id);
    if (!doctor) throw new HttpException(409, "Doctor doesn't exist");

    const specialist = await SpecialistEntity.findOne(payload.specialistId);
    if (!specialist) throw new HttpException(409, "Specialist doesn't exist");

    const newPayload = {
      ...payload,
      services: JSON.stringify(payload.services),
      degree: JSON.stringify(payload.degree),
      college: JSON.stringify(payload.college),
      experience: JSON.stringify(payload.experience),
      designation: JSON.stringify(payload.designation),
      awards: JSON.stringify(payload.awards),
      specialist,
    };
    const result = await DoctorEntity.update(id, unPick(newPayload, ['id', 'email']));
    return result;
  }

  public async deleteDoctor(id: string) {
    const result = await getManager().transaction(
      async (transactionalEntityManager: EntityManager) => {
        // Kiểm tra xem bác sĩ có tồn tại hay không
        const doctor = await transactionalEntityManager.getRepository(DoctorEntity).findOne(id, {
          relations: ['specialist'], // Đảm bảo load thông tin của chuyên khoa
        });

        if (!doctor) {
          throw new HttpException(404, 'Doctor not found');
        }

        // Xóa bác sĩ khỏi bảng DoctorEntity
        await transactionalEntityManager.getRepository(DoctorEntity).delete(id);

        // Kiểm tra xem có chuyên khoa được liên kết không
        if (doctor.specialist) {
          // Cập nhật bác sĩ đóng góp vào mảng doctors của chuyên khoa
          doctor.specialist.doctors = doctor.specialist.doctors.filter(doc => doc.id !== id);
          await transactionalEntityManager.getRepository(SpecialistEntity).save(doctor.specialist);
        }
      },
    );

    return result;
  }

  public async getDoctorById(doctorId: string) {
    const doctor = await DoctorEntity.findOne(doctorId);
    if (!doctor) throw new HttpException(409, "Doctor doesn't exist");
    return doctor;
  }
  public async getAllDoctor(
    filters: IDoctorFilters,
    options: IOption,
  ): Promise<IGenericResponse<Doctor[]>> {
    const { limit, page, skip } = calculatePagination(options);
    const { searchTerm, max, min, specialist, ...filterData } = filters;
    const queryBuilder = DoctorEntity.createQueryBuilder('doctor');

    if (searchTerm) {
      DoctorSearchableFields.forEach((field, index) => {
        queryBuilder.orWhere(`${field} ILike :searchTerm${index}`, {
          [`searchTerm${index}`]: `%${searchTerm}%`,
        });
      });
    }

    if (max) {
      queryBuilder.andWhere('doctor.price <= :max', { max });
    }

    if (min) {
      queryBuilder.andWhere('doctor.price >= :min', { min });
    }

    if (specialist) {
      queryBuilder.andWhere('doctor.specialization ILike :specialist', {
        specialist: `%${specialist}%`,
      });
    }

    if (filterData) {
      Object.keys(filterData).forEach((key, index) => {
        if (filterData[key]) {
          queryBuilder.andWhere(`doctor.${key} ILike :filterData${index}`, {
            [`filterData${index}`]: `%${filterData[key]}%`,
          });
        }
      });
    }

    const [data, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return {
      meta: {
        page,
        limit,
        total,
      },
      data,
    };
  }
}
