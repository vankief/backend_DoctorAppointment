import { Request, Response } from 'express';
import { AdminService } from '@api/services/admins.service';
import { OK } from '@/helpers/valid_response/success.response';

export class AdminController {
  public admin = new AdminService();
  public signUp = async (req: Request, res: Response) => {
    const admin = await this.admin.signUp(req.body);
    new OK({ message: 'Admin created successfully', data: admin }).send(res);
  };
  public getAdminById = async (req: Request, res: Response) => {
    const admin = await this.admin.getAdminById(req.params.id);
    new OK({ message: 'Admin found successfully', data: admin }).send(res);
  };
  public updateAdmin = async (req: Request, res: Response) => {
    const admin = await this.admin.updateAdmin(req.params.id, req.body);
    new OK({ message: 'Admin updated successfully', data: admin }).send(res);
  };
  public deleteAdmin = async (req: Request, res: Response) => {
    const result = await this.admin.deleteAdmin(req.params.id);
    new OK({ message: 'Admin deleted successfully', data: result }).send(res);
  };
}
