import { ICreateDoctor } from '@/interfaces/doctors.interface.';
import { DoctorEntity } from '../doctors.entity';

export default class DoctorRepo {
  public static async createDoctor(payload: ICreateDoctor) {
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

    const doctor = await DoctorEntity.create(newPayload).save();
    return doctor;
  }
}
