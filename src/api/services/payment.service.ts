import { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } from '@/config';
import { HttpException } from '@/helpers/exceptions/httpException';
import { Service } from 'typedi';
const stripe = require('stripe')(STRIPE_SECRET_KEY);

@Service()
export class PaymentService {
  public async createPaymentIntent(amount: number, currency: string, customerId: string) {
    const customer = await stripe.customer.create();

    // Tạo Ephemeral Key
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2023-10-16' },
    );

    // Tạo Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      paymentIntentClientSecret: paymentIntent.client_secret,
      ephemeralKeySecret: ephemeralKey.secret,
      customerId: customer.id,
      publishableKey: STRIPE_PUBLISHABLE_KEY,
    };
  }
}
