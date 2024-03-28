import { EPaymentStatus, EStatus } from '@/constants';
import { PaymentDetailEntity } from '../paymentDetail.entity';
import { AppointmentEntity } from '../appointment.entity';
import AppointmentRepo from './appointment.repo';
import { STRIPE_SECRET_KEY } from '@/config';
const stripe = require('stripe')(STRIPE_SECRET_KEY);

export default class PaymentDetailRepo {
  public static async createPaymentInfo(appointment: AppointmentEntity) {
    const amount = appointment.fee;
    const currency = 'vnd';
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2023-10-16' },
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        appointment: appointment,
      },
    });
    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    };
  }
  public static async createPaymentDetail({
    appointment,
    paymentStatus,
    amountPad,
  }: {
    appointment: AppointmentEntity;
    paymentStatus: EPaymentStatus;
    amountPad: Number;
  }) {
    await AppointmentRepo.updateAppointmentStatus(appointment, EStatus.APPROVED);
    const paymentDetail = new PaymentDetailEntity();
    paymentDetail.appointment = appointment;
    paymentDetail.paymentStatus = paymentStatus;
    paymentDetail.amountPad = amountPad;
    await paymentDetail.save();
    return paymentDetail;
  }
  public static async getPaymentDetailById(id: string) {
    const paymentDetail = await PaymentDetailEntity.findOne({
      where: { id },
    });
    return paymentDetail;
  }
}
