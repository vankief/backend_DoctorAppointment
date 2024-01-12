import { Role } from '@/constants';
import { AdminEntity } from '@/entities/admin.entity';
import { AuthEntity } from '@/entities/auth.entity';
import { HttpException } from '@/exceptions/httpException';
import { Admin, AdminSignUp } from '@/interfaces/admin.interface';
import { Auth } from '@/interfaces/auth.interface';
import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { EntityManager, EntityRepository, Repository, Transaction, TransactionManager, getManager } from 'typeorm';

@Service()
@EntityRepository()
export class AdminService extends Repository<AdminEntity> {
  public async signUp(payload: AdminSignUp): Promise<{
    admin: Admin;
  }> {
    const entityManager = getManager();
    const { password, ...adminData } = payload;
    const admin = await entityManager.transaction(async transactionalEntityManager => {
      const admin = await transactionalEntityManager.getRepository(AdminEntity).save({ ...adminData });
      return admin;
    });
    if (admin) {
      await entityManager.getRepository(AuthEntity).save({
        email: adminData.email,
        password: await hash(password, 10),
        userId: admin.id,
        role: Role.ADMIN,
      });
      return { admin };
    }
  }
}
