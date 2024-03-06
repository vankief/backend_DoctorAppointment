import Container from 'typedi';
import { PatientService } from '../services/patients.service';
import { Request, Response } from 'express';
import { OK } from '@/helpers/valid_response/success.response';

export class PatientController {
  public patient = Container.get(PatientService);

  public signup = async (req: Request, res: Response) => {
    const { tokens, patient } = await this.patient.signup(req.body);
    new OK({
      message: 'Patient created successfully',
      data: tokens,
    }).send(res);
  };
  public updatePatient = async (req: Request, res: Response) => {
    const patient = await this.patient.updatePatient(req.params.id, req.body);
    new OK({
      message: 'Patient updated successfully',
      data: patient,
    }).send(res);
  };
  public getPatientById = async (req: Request, res: Response) => {
    const patient = await this.patient.getPatientById(req.params.id);
    new OK({
      message: 'Patient retrieved successfully',
      data: patient,
    }).send(res);
  };
  public deletePatient = async (req: Request, res: Response) => {
    const result = await this.patient.deletePatient(req.params.id);
    new OK({
      message: 'Patient deleted successfully',
      data: result,
    }).send(res);
  };
  public getAllPatients = async (req: Request, res: Response) => {
    const patients = await this.patient.getAllPatients();
    new OK({
      message: 'Patients retrieved successfully',
      data: patients,
    }).send(res);
  };
}
