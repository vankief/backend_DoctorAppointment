import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '@entities/users.entity';
import { AuthEntity } from '@/entities/auth.entity';
import { HttpException } from '@/exceptions/httpException';
import { Auth, DataStoredInToken, ILoginData, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { Role } from '@/constants';
import { generateTokens } from '@/utils/createToken';

@Service()
@EntityRepository()
export class AuthService extends Repository<Auth> {
  public async login(data: ILoginData): Promise<{
    tokens: {
      accessToken: String;
      refreshToken: String;
    };
    findUser: Auth;
  }> {
    const findUser: Auth = await AuthEntity.findOne({ where: { email: data.email } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const isPasswordMatching: boolean = await compare(data.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password not matching');
    const payload: DataStoredInToken = {
      userId: findUser.userId,
      role: findUser.role,
    };
    const tokens = generateTokens(payload);
    return { tokens, findUser };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
}
