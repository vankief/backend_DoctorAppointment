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
}
