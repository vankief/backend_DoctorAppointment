import { Auth } from '@/interfaces/auths.interface';
import { AuthEntity } from '../auths.entity';

export default class AuthRepo {
  public static async createAuth(payload: Auth) {
    const auth = await AuthEntity.create(payload).save();
    return auth;
  }
}
