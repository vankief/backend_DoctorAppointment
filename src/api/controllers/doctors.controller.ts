import Container from 'typedi';
import { DoctorsService } from '../services/doctors.service';
import { Request, Response } from 'express';
import { OK } from '@/helpers/valid_response/success.response';
import {
  IDoctorFilters,
  IDoctorFiltersData,
  IDoctorOptions,
} from '@/interfaces/doctors.interface.';
import pick from '@/utils/pick';
import { IOption } from '@/utils/paginationHelper';

export class DoctorsController {
  public doctor = Container.get(DoctorsService);
  public createDoctor = async (req: Request, res: Response) => {
    const doctor = await this.doctor.createDoctor(req.body);
    new OK({
      message: 'Doctor created successfully',
      data: doctor,
    }).send(res);
  };

  public updateDoctor = async (req: Request, res: Response) => {
    const doctor = await this.doctor.updateDoctor(req.params.id, req.body);
    new OK({
      message: 'Doctor updated successfully',
      data: doctor,
    }).send(res);
  };

  public getDoctorById = async (req: Request, res: Response) => {
    const doctors = await this.doctor.getDoctorById(req.params.id);
    new OK({
      message: 'Doctors retrieved successfully',
      data: doctors,
    }).send(res);
  };

  public deleteDoctor = async (req: Request, res: Response) => {
    const result = await this.doctor.deleteDoctor(req.params.id);
    new OK({
      message: 'Doctors deleted successfully',
      data: result,
    }).send(res);
  };

  public getAllDoctors = async (req: Request, res: Response) => {
    const filter: IDoctorFilters = pick(req.query, IDoctorFiltersData);
    const options: IOption = pick(req.query, IDoctorOptions);
    const doctors = await this.doctor.getAllDoctor(filter, options);
    new OK({
      message: 'Doctors retrieved successfully',
      data: doctors,
    }).send(res);
  };

  public getTopDoctor = async (req: Request, res: Response) => {
    const doctors = await this.doctor.getTopDoctor();
    new OK({
      message: 'Doctors retrieved successfully',
      data: doctors,
    }).send(res);
  };

  public getDoctorByPatient = async (req: Request, res: Response) => {
    const doctorId = req.params.id;
    const doctor = await this.doctor.getDoctorByPatient(doctorId);
    new OK({
      message: 'Doctor retrieved successfully',
      data: doctor,
    }).send(res);
  };

  public getDoctorPrice = async (req: Request, res: Response) => {
    const doctorId = req.params.id;
    const doctor = await this.doctor.getDoctorPrice(doctorId);
    new OK({
      message: 'Doctor price retrieved successfully',
      data: doctor,
    }).send(res);
  };
}
