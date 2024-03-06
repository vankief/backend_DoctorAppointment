export interface ICreateAppointment {
  patientId: string;
  doctorId: string;
  reason: string;
  scheduledTime: string;
  scheduledDate: string;
  paymentType: string;
}

export interface Appointment {
  id?: string;
  reason: string;
  scheduledTime: string;
  scheduledDate: string;
  paymentType: string;
  status: string;
  fee: number;
}

export interface IGetListAppointment {
  doctorId?: string;
  patientId?: string;
  filter: {
    scheduledDate?: string;
    scheduledTime?: string;
    status?: string;
  };
  isAdmin?: boolean;
}
export interface IGetAppointmentByAdmin {
  doctorId: string;
  scheduleDate: string;
  scheduleTime: string;
  status: string;
}
