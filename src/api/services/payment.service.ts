import { Appointment } from '@/interfaces/appointment.interface';
import { Service } from 'typedi';

@Service()
export class PaymentService {
  public async makePayment(appointment: Appointment) {
    // Make payment here
    return true;
  }
}
