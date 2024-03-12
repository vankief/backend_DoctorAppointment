import Container from 'typedi';
import { DoctorsService } from '../services/doctors.service';
import { Request, Response } from 'express';
import { OK } from '@/helpers/valid_response/success.response';
import { ICreateSpecialist } from '@/interfaces/specialist.interface';
import { SpecialistService } from '../services/specialist.service';

export class SpecialistController {
  public specialist = Container.get(SpecialistService);

  public createSpecialist = async (req: Request, res: Response) => {
    const data = req.body as ICreateSpecialist;
    const specialist = await this.specialist.createSpecialist(data);
    new OK({
      message: 'Specialist created successfully',
      data: specialist,
    }).send(res);
  };

  public updateSpecialist = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;
    const specialist = await this.specialist.updateSpecialist(id, data);
    new OK({
      message: 'Specialist updated successfully',
      data: specialist,
    }).send(res);
  };

  public deleteSpecialist = async (req: Request, res: Response) => {
    const id = req.params.id;
    const specialist = await this.specialist.deleteSpecialist(id);
    new OK({
      message: 'Specialist deleted successfully',
      data: specialist,
    }).send(res);
  };

  public getSpecialistById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const specialist = await this.specialist.getSpecialistById(id);
    new OK({
      message: 'Specialist fetched successfully',
      data: specialist,
    }).send(res);
  };

  public getAllSpecialists = async (req: Request, res: Response) => {
    const specialists = await this.specialist.getAllSpecialists();
    new OK({
      message: 'Specialists fetched successfully',
      data: specialists,
    }).send(res);
  };

  public getListSpecialistWithDoctors = async (req: Request, res: Response) => {
    const specialistId = req.params.id;
    const doctors = await Container.get(DoctorsService).getDoctorsBySpecialist(specialistId);
    new OK({
      message: 'Doctors fetched successfully',
      data: doctors,
    }).send(res);
  };

  public getNumberOfDoctors = async (req: Request, res: Response) => {
    console.log('312321');
    const specialists = await this.specialist.getNumberOfDoctors();
    new OK({
      message: 'Number of doctors fetched successfully',
      data: specialists,
    }).send(res);
  };
}
