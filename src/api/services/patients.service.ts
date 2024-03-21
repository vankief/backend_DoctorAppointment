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
import PatientRepo from '@/entities/repo/patient.repo';
@Service()
@EntityRepository()
export class PatientService {
  tokensService = new TokensService();
  public async signup(payload: ICreatePatient) {
    const patient = await PatientRepo.createPatient(payload);
    const data: DataStoredInToken = {
      userId: patient.id,
      role: Role.PATIENT,
    };
    const tokens = generateTokens(data);
    await this.tokensService.saveRefreshToken(patient.id, tokens.refreshToken);
    return { tokens, patient };
  }

  public async updatePatient(id: string, payload: Partial<Patient>) {
    const patient = await PatientRepo.updatePatient(id, payload);
    return patient;
  }

  public async deletePatient(patientId: string) {
    return await PatientRepo.deletePatient(patientId);
  }

  public async getAllPatients() {
    return await PatientEntity.find();
  }

  public async getPatientById(id: string) {
    return await PatientRepo.getPatientById(id);
  }
}
