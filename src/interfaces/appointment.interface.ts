export interface ICreateAppointment {
  reason: string;
  scheduledTime: string;
  scheduledDate: string;
  fee: number;
  patientName: String;
  patientPhone: String;
  patientAge: String;
  patientGender: Boolean;
  service: String;
}

export interface Appointment {
  id?: string;
  patientName: String;
  patientPhone: String;
  patientAge: String;
  patientGender: Boolean;
  fee: number;
  reason: String;
  scheduledTime: String;
  scheduledDate: String;
  service: String;
  paymentType: String;
  status: String;
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
