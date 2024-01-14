import { Role } from '@/constants';
import { AdminEntity } from '@/entities/admins.entity';
import { AuthEntity } from '@/entities/auths.entity';
import { HttpException } from '@/exceptions/httpException';
import { Admin, AdminSignUp } from '@/interfaces/admins.interface';
import { Auth } from '@/interfaces/auths.interface';
import { hash } from 'bcrypt';
import { Service } from 'typedi';
import {
  EntityManager,
  EntityRepository,
  Repository,
  Transaction,
  TransactionManager,
  getManager,
} from 'typeorm';

@Service()
@EntityRepository()
export class AdminService extends Repository<AdminEntity> {
  public async signUp(payload: AdminSignUp): Promise<{
    admin: Admin;
  }> {
    const entityManager = getManager();
    const { password, ...adminData } = payload;
    const admin = await entityManager.transaction(
      async transactionalEntityManager =>
        await transactionalEntityManager.getRepository(AdminEntity).save({ ...adminData }),
    );
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
