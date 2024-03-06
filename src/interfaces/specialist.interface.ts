export interface Specialist {
  id?: string;
  name: string;
  description: string;
  image: string;
}

export interface ICreateSpecialist {
  name: string;
  description: string;
  image: string;
}
