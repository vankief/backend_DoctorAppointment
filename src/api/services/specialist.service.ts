import { SpecialistEntity } from '@/entities/specialist.entity';
import { HttpException } from '@/helpers/exceptions/httpException';
import { ICreateSpecialist } from '@/interfaces/specialist.interface';
import { unPick } from '@/utils/pick';
import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';

@Service()
@EntityRepository()
export class SpecialistService extends Repository<SpecialistEntity> {
  public async createSpecialist(payload: ICreateSpecialist) {
    const { name, description, image } = payload;
    const specialist = await SpecialistEntity.findOne({ where: { name } });

    if (specialist) throw new HttpException(409, 'Specialist already exists');

    const result = await SpecialistEntity.create({
      name,
      description,
      image,
    }).save();
    return result;
  }

  public async updateSpecialist(id: string, payload: Partial<SpecialistEntity>) {
    const newPayload = unPick(payload, ['id']);

    const specialist = await SpecialistEntity.findOne(id);

    if (!specialist) throw new HttpException(409, "Specialist doesn't exist");

    return await SpecialistEntity.update({ id }, newPayload);
  }

  public async deleteSpecialist(id: string) {
    const specialist = await SpecialistEntity.findOne(id);
    if (!specialist) throw new HttpException(409, "Specialist doesn't exist");
    return await SpecialistEntity.delete({ id });
  }

  public async getSpecialistById(id: string) {
    const specialist = await SpecialistEntity.findOne(id);
    if (!specialist) throw new HttpException(409, "Specialist doesn't exist");
    return specialist;
  }

  public async getAllSpecialists() {
    return await SpecialistEntity.find();
  }

  public async getListSpecialistWithDoctors(id: string) {
    const specialist = await SpecialistEntity.findOne(id, { relations: ['doctors'] });
    if (!specialist) throw new HttpException(409, "Specialist doesn't exist");
    return specialist;
  }

  public async getNumberOfDoctors() {
    const specialists = await SpecialistEntity.find({ relations: ['doctors'] });
    const result = specialists.map(specialist => {
      return {
        id: specialist.id,
        name: specialist.name,
        numberOfDoctors: specialist.doctors.length,
      };
    });
    return result;
  }
}
