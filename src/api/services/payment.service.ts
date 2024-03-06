import { DoctorEntity } from '@/entities/doctors.entity';
import { Appointment } from '@/interfaces/appointment.interface';
import { Service } from 'typedi';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export class PaymentService {
  public createCheckoutSession = async (req, res) => {
    const doctorId = req.params.doctorId;
    const email = req.body.email;
    const doctor = await DoctorEntity.findOne(doctorId);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'vnd',
            product_data: {
              name: doctor.name,
            },
            unit_amount: doctor.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/`,
      cancel_url: `${req.protocol}://${req.get('host')}/doctor/${doctorId}`,
    });
    res.json({ session });
  };
}
