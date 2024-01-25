import { DoctorEntity } from '@/entities/doctors.entity';
import { ScheduleDay } from '@/entities/scheduleDay.entity';

export interface Doctor {
  name: string;
  email: string;
  address: string;
  img?: string;
  phone: string;
  gender: boolean;
  dob: string;
  biography?: string;
  price?: number;
  services: string; // dịch vụ
  specialization: string; //chuyên khoa
  degree: string; //bằng cấp
  college: string;
  completionYear: string;
  experience: string; // kinh nghiệm
  designation: string; // chức vụ hiện tại
  awards: string; // giải thưởng
  registration: string; // số đăng ký hành nghề
  year: string;
}
export interface ICreateDoctor {
  name: string;
  email: string;
  address: string;
  img?: string;
  phone: string;
  gender: boolean;
  dob: string;
  biography?: string;
  price?: number;
  services?: string;
  specialization?: string;
  degree?: string;
  college?: string;
  completionYear?: string;
  experience?: string;
  designation?: string;
  awards?: string;
  registration?: string;
  year?: string;
}

export interface IListTime {
  timeSlot: string;
  maximumPatient: number;
}

export interface ICreateTimeSlot {
  doctorId: string;
  day: string;
  listTime: IListTime[];
}
export interface DoctorTimeSlot {
  id?: number;
  doctor: DoctorEntity;
  day: string;
  isPublic: boolean;
  listTime: ScheduleDay[];
}
export type IDoctorFilters = {
  searchTerm?: string;
  name?: string;
  gender?: string;
  max?: string;
  min?: string;
  specialist?: string;
};
export const IDoctorFiltersData = ['searchTerm', 'name', 'gender', 'max', 'min', 'specialist'];
export const IDoctorOptions = ['limit', 'page', 'sortBy', 'sortOrder'];

export const DoctorSearchableFields = ['name', 'address', 'specialization', 'degree'];
