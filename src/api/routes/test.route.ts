import { Routes } from '@/interfaces/routes.interface';
import express, { Router } from 'express';
import { PaymentService } from '../services/payment.service';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '@/config';
const stripe = require('stripe')(STRIPE_SECRET_KEY);
export class TestRouter implements Routes {
  public path = '';
  public router = Router();
  public payment = new PaymentService();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}`, (req, res) => {
      res.send('Hello World!');
    });

    this.router.post(`${this.path}/payment-sheet`, express.json(), async (req, res) => {
      console.log('🚀 ~ TestRouter ~ this.router.post ~ req:', req.body);
      const amount = req.body.amount;
      console.log('🚀 ~ TestRouter ~ this.router.post ~ amount:', amount);
      const currency = req.body.currency;
      const paymentId = req.body.paymentMethodId;
      // Use an existing Customer ID if this is a returning customer.
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
          paymentId: paymentId,
        },
      });

      res.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      });
    });
    this.router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
      const sig = req.headers['stripe-signature'];

      const payload = req.body;
      let event;

      try {
        event = stripe.webhooks.constructEvent(payload, sig, STRIPE_WEBHOOK_SECRET);
      } catch (err) {
        console.log('🚀 ~ TestRouter ~ this.router.post ~ err:', err);
        return res.sendStatus(400);
      }
      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          const paymentId = paymentIntent.metadata.paymentId;
          console.log('🚀 ~ TestRouter ~ this.router.post ~ paymentId:', paymentId);
          console.log('PaymentIntent was successful!');
          break;
        case 'payment_method.attached':
          const paymentMethod = event.data.object;
          console.log('PaymentMethod was attached to a Customer!');
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      // Return a response to acknowledge receipt of the event
      res.json({ received: true });
    });
  }
}
