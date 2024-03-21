import { ICreatePatient, Patient } from '@/interfaces/patients.interface';
import { getManager } from 'typeorm';
import { PatientEntity } from '../patient.entity';
import { unPick } from '@/utils/pick';
import { HttpException } from '@/helpers/exceptions/httpException';
import { AuthEntity } from '../auths.entity';
import { hash } from 'bcrypt';
import { Role } from '@/constants';

export default class PatientRepo {
  public static async createPatient(payload: ICreatePatient) {
    const entityManager = getManager();
    const { password, ...patientData } = payload;
    const isPatientCreated = await AuthEntity.findOne({ where: { email: patientData.email } });
    if (isPatientCreated) {
      throw new HttpException(409, 'Patient already exists');
    }
    const patient = await entityManager.transaction(
      async transactionalEntityManager =>
        await transactionalEntityManager.getRepository(PatientEntity).save(patientData),
    );
    if (patient) {
      await entityManager.getRepository(AuthEntity).save({
        email: patient.email,
        password: await hash(password, 10),
        userId: patient.id,
        role: Role.PATIENT,
      });
    }
    return patient;
  }

  public static async updatePatient(id: string, payload: Partial<Patient>) {
    const newPayload = unPick(payload, ['id', 'email']);
    const patient = await PatientEntity.findOne(id);
    if (!patient) throw new HttpException(409, "Patient doesn't exist");
    await PatientEntity.update(id, newPayload);
    return await PatientEntity.findOne(id);
  }

  public static async deletePatient(patientId: string) {
    const patient = await PatientEntity.findOne(patientId);
    if (!patient) throw new HttpException(409, "Patient doesn't exist");
    const result = await PatientEntity.delete({ id: patientId });
    await AuthEntity.delete({ userId: patientId });
    return result;
  }

  public static async getPatientById(id: string) {
    const patient = await PatientEntity.findOne(id);
    if (!patient) throw new HttpException(409, "Patient doesn't exist");
    return patient;
  }
}
