import { DoctorEntity } from '@/entities/doctors.entity';
import { ScheduleDayEntity } from '@/entities/scheduleDay.entity';

export interface Doctor {
  name: string;
  email: string;
  address: string;
  img?: string;
  phone: string;
  gender: boolean;
  dob: string;
  price?: number;
  services: string; // dịch vụ
  degree: string; //bằng cấp
  college: string;
  experience: string; // kinh nghiệm
  designation: string; // chức vụ hiện tại
  awards: string; // giải thưởng
}
export interface ICreateDoctor {
  name: string;
  email: string;
  address: string;
  img?: string;
  phone: string;
  gender: boolean;
  dob: string;
  specialistId: string;
  price?: number;
  services?: string;
  degree?: string;
  college?: string;
  experience?: string;
  designation?: string;
  awards?: string;
}

export interface IUpdateDoctor {
  name?: string;
  address?: string;
  img?: string;
  phone?: string;
  gender?: boolean;
  dob?: string;
  price?: number;
  services?: string;
  degree?: string;
  college?: string;
  experience?: string;
  designation?: string;
  awards?: string;
  specialistId?: string; // Chỉ cập nhật ID của chuyên khoa
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
  listTime: ScheduleDayEntity[];
}
export interface IGetListDoctorTimeSlot {
  doctorId: string;
  day: string;
}

export interface IGetListDoctorTimeSlotStartEndDay {
  doctorId: string;
  startDay: string;
  endDay: string;
  isPublic?: boolean;
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
