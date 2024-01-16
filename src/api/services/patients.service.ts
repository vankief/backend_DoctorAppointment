import { Role } from '@/constants';
import { AuthEntity } from '@/entities/auths.entity';
import { PatientEntity } from '@/entities/patient.entity';
import { HttpException } from '@/exceptions/httpException';
import { ICreatePatient, Patient } from '@/interfaces/patients.interface';
import { unPick } from '@/utils/pick';
import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { EntityRepository, getManager } from 'typeorm';
@Service()
@EntityRepository()
export class PatientService {
  public async signup(payload: ICreatePatient) {
    const entityManager = getManager();
    const { password, ...patientData } = payload;

    const isPatientCreated = await entityManager.getRepository(AuthEntity).findOne({
      where: { email: patientData.email },
    });
    if (isPatientCreated) throw new HttpException(409, 'Patient already exists');

    let patient;
    try {
      await entityManager.transaction(async transactionalEntityManager => {
        patient = await transactionalEntityManager.getRepository(PatientEntity).save(patientData);
        await transactionalEntityManager.getRepository(AuthEntity).save({
          email: patient.email,
          password: await hash(password, 10),
          userId: patient.id,
          role: Role.PATIENT,
        });
      });
    } catch (error) {
      throw new HttpException(409, 'Cannot save patient');
    }

    return patient;
  }
  public async updatePatient(id: string, payload: Partial<Patient>) {
    const newPayload = unPick(payload, ['id', 'email']);
    const patient = await PatientEntity.findOne(id);
    if (!patient) throw new HttpException(409, "Patient doesn't exist");
    return await PatientEntity.update({ id }, newPayload);
  }
  public async deletePatient(patientId: string) {
    const result = await getManager().transaction(async transactionalEntityManager => {
      const patient = await transactionalEntityManager
        .getRepository(PatientEntity)
        .findOne(patientId);
      if (!patient) throw new HttpException(409, "Patient doesn't exist");
      await transactionalEntityManager.getRepository(PatientEntity).delete(patientId);
      await transactionalEntityManager.getRepository(AuthEntity).delete({ userId: patientId });
    });
    return result;
  }
  public async getAllPatients() {
    return await PatientEntity.find();
  }

  public async getPatientById(id: string) {
    const patient = await PatientEntity.findOne(id);
    if (!patient) throw new HttpException(409, "Patient doesn't exist");
    return patient;
  }
}
