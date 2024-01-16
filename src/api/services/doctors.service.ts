import { Role } from '@/constants';
import { AuthEntity } from '@/entities/auths.entity';
import { DoctorEntity } from '@/entities/doctors.entity';
import { HttpException } from '@/exceptions/httpException';
import { IGenericResponse } from '@/interfaces/auths.interface';
import {
  Doctor,
  DoctorSearchableFields,
  ICreateDoctor,
  IDoctorFilters,
} from '@/interfaces/doctors.interface.';
import { convertDate } from '@/utils';
import calculatePagination, { IOption } from '@/utils/paginationHelper';
import pick, { unPick } from '@/utils/pick';
import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { EntityRepository, getManager } from 'typeorm';

@Service()
@EntityRepository()
export class DoctorsService {
  public async createDoctor(payload: ICreateDoctor) {
    const entityManager = getManager();
    const newPayload = {
      ...payload,
      services: JSON.stringify(payload.services),
      specialization: JSON.stringify(payload.specialization),
      degree: JSON.stringify(payload.degree),
      college: JSON.stringify(payload.college),
      completionYear: JSON.stringify(payload.completionYear),
      experience: JSON.stringify(payload.experience),
      designation: JSON.stringify(payload.designation),
      awards: JSON.stringify(payload.awards),
      registration: JSON.stringify(payload.registration),
    };
    const doctor = await entityManager.transaction(
      async transactionalEntityManager =>
        await transactionalEntityManager.getRepository(DoctorEntity).save(newPayload),
    );

    const password = convertDate(new Date(payload.dob));
    if (doctor) {
      await entityManager.getRepository(AuthEntity).save({
        email: doctor.email,
        password: await hash(password, 10),
        userId: doctor.id,
        role: Role.DOCTOR,
      });
    }
    return doctor;
  }

  public async updateDoctor(id: string, payload: Partial<Doctor>) {
    const newPayload = unPick(payload, ['id', 'email']);
    const doctor = await DoctorEntity.findOne(id);
    if (!doctor) throw new HttpException(409, "Doctor doesn't exist");
    return await DoctorEntity.update({ id }, newPayload);
  }

  public async deleteDoctor(id: string) {
    const result = await getManager().transaction(async transactionalEntityManager => {
      const doctor = await transactionalEntityManager.getRepository(DoctorEntity).findOne(id);
      if (!doctor) throw new HttpException(409, "Doctor doesn't exist");
      await transactionalEntityManager.getRepository(DoctorEntity).delete(id);
      await transactionalEntityManager.getRepository(AuthEntity).delete({ userId: id });
    });
    return result;
  }

  public async getDoctorById(id: string) {
    const doctor = await DoctorEntity.findOne(id);
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
      const lowerSearchTerm = searchTerm.toLowerCase();
      DoctorSearchableFields.forEach((field, index) => {
        queryBuilder.orWhere(`LOWER(${field}) LIKE :searchTerm${index}`, {
          [`searchTerm${index}`]: `%${lowerSearchTerm}%`,
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
      const lowerSpecialist = specialist.toLowerCase();
      queryBuilder.andWhere(`LOWER(doctor.specialization) LIKE :specialist`, {
        specialist: `%${lowerSpecialist}%`,
      });
    }

    if (filterData) {
      Object.keys(filterData).forEach((key, index) => {
        if (filterData[key]) {
          const lowerFilterData = filterData[key].toLowerCase();
          queryBuilder.andWhere(`LOWER(doctor.${key}) LIKE :filterData${index}`, {
            [`filterData${index}`]: `%${lowerFilterData}%`,
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
