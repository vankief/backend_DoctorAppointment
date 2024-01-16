export interface Patient {
  name: string;
  email: string;
  address: string;
  img?: string;
  phone: string;
  gender: boolean;
  dob: string;
}
export interface ICreatePatient {
  name: string;
  email: string;
  address: string;
  img?: string;
  phone: string;
  gender: boolean;
  dob: string;
  password: string;
}
