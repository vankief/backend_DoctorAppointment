import { EPaymentStatus } from '@/constants';

export interface PaymentDetail {
  id?: String;
  paymentStatus: EPaymentStatus;
  amountPad: Number;
}
