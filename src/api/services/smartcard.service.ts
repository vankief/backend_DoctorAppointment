import { Service } from 'typedi';

@Service()
export class SmartCardService {
  public async getSmartCardByPatientId(patientId: string) {
    // Get smartcard by patient id
    return true;
  }
}
