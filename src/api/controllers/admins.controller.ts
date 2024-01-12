import { Request, Response } from 'express';
import { AdminService } from '@api/services/admins.service';
import { OK } from '@/helpers/valid_response/success.response';

export class AdminController {
  public admin = new AdminService();
  public signUp = async (req: Request, res: Response): Promise<void> => {
    const admin = await this.admin.signUp(req.body);
    new OK({ message: 'Admin created successfully', data: admin }).send(res);
  };
}
