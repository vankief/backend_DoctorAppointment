import { Role } from '@/constants';
import { AuthEntity } from '@/entities/auths.entity';
import { PatientEntity } from '@/entities/patient.entity';
import { HttpException } from '@/helpers/exceptions/httpException';
import { DataStoredInToken } from '@/interfaces/auths.interface';
import { ICreatePatient, Patient } from '@/interfaces/patients.interface';
import { generateTokens } from '@/utils/generateTokens';
import { unPick } from '@/utils/pick';
import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { EntityRepository, getManager } from 'typeorm';
import { TokensService } from './tokens.service';
@Service()
@EntityRepository()
export class PatientService {
  tokensService = new TokensService();
  public async signup(payload: ICreatePatient) {
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
    const data: DataStoredInToken = {
      userId: patient.id,
      role: Role.PATIENT,
    };
    const tokens = generateTokens(data);
    await this.tokensService.saveRefreshToken(patient.id, tokens.refreshToken);
    return { tokens, patient };
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
