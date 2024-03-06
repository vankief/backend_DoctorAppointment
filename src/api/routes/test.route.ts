import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';
import { AdminController } from '@api/controllers/admins.controller';
import asyncHandler from '@/utils/asyncHandler';
import { PaymentService } from '../services/payment.service';
export class TestRouter implements Routes {
  public path = '/test';
  public router = Router();
  public payment = new PaymentService();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}`, (req, res) => {
      res.send('Hello World!');
    });

    this.router.get(
      `/checkout-session/:doctorId`,
      asyncHandler(this.payment.createCheckoutSession),
    );
  }
}
