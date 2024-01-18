import { Role } from '@/constants';
import { AdminEntity } from '@/entities/admins.entity';
import { AuthEntity } from '@/entities/auths.entity';
import { HttpException } from '@/exceptions/httpException';
import { Admin, AdminSignUp } from '@/interfaces/admins.interface';
import { unPick } from '@/utils/pick';
import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { EntityRepository, Repository, getManager } from 'typeorm';

@Service()
@EntityRepository()
export class AdminService extends Repository<AdminEntity> {
  public async signUp(payload: AdminSignUp): Promise<{
    admin: Admin;
  }> {
    const entityManager = getManager();
    const { password, ...adminData } = payload;
    // check email is exist
    const isExist = AuthEntity.findOne({ email: adminData.email });
    if (isExist) throw new HttpException(409, 'Email already exist');
    const admin = await entityManager.transaction(
      async transactionalEntityManager =>
        await transactionalEntityManager.getRepository(AdminEntity).save({ ...adminData }),
    );
    if (admin) {
      await entityManager.getRepository(AuthEntity).save({
        email: admin.email,
        password: await hash(password, 10),
        userId: admin.id,
        role: Role.ADMIN,
      });
      return { admin };
    }
  }
  public async getAdminById(id: string): Promise<Admin> {
    const admin = await AdminEntity.findOne({ where: { id } });
    if (!admin) throw new HttpException(404, 'Admin not found');
    return admin;
  }
  public async updateAdmin(id: string, payload: Admin): Promise<Admin> {
    const newPayload = unPick(payload, ['id', 'email']);
    const admin = await AdminEntity.findOne({ where: { id } });
    if (!admin) throw new HttpException(404, 'Admin not found');
    await AdminEntity.update(id, newPayload);
    return admin;
  }
  public async deleteAdmin(id: string) {
    const result = getManager().transaction(async transactionalEntityManager => {
      const admin = await transactionalEntityManager.getRepository(AdminEntity).findOne(id);
      if (!admin) throw new HttpException(404, 'Admin not found');
      await transactionalEntityManager.getRepository(AuthEntity).delete({ userId: id });
      await transactionalEntityManager.getRepository(AdminEntity).delete(id);
      return result;
    });
  }
}
