export enum Role {
  ADMIN = 'admin',
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}
export enum ListTime {
  T1 = '9:00AM - 10:00AM',
  T2 = '10:00AM - 11:00AM',
  T3 = '11:00AM - 12:00PM',
  T4 = '1:30PM - 2:30PM',
  T5 = '2:30PM - 3:30PM',
  T6 = '3:30PM - 4:30PM',
}

export enum EListTime {
  T1 = 'T1',
  T2 = 'T2',
  T3 = 'T3',
  T4 = 'T4',
  T5 = 'T5',
  T6 = 'T6',
}
export enum Service {
  ONLINE = 'online',
  OFFLINE = 'offline',
}
export enum EStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  AWAITING_PAYMENT = 'AWAITING_PAYMENT',
}

export enum EPaymentType {
  ONLINE = 'ONLINE',
  SMARTCARD = 'SMARTCARD',
}
