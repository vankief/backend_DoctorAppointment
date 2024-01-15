import { compare } from 'bcrypt';
import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { AuthEntity } from '@/entities/auths.entity';
import { HttpException } from '@/exceptions/httpException';
import { Auth, DataStoredInToken, ILoginData } from '@/interfaces/auths.interface';
import { generateTokens } from '@/utils/generateTokens';
import { TokensService } from './tokens.service';

@Service()
@EntityRepository()
export class AuthService extends Repository<Auth> {
  tokensService = new TokensService();
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
    await this.tokensService.saveRefreshToken(findUser.userId, tokens.refreshToken);
    return { tokens, findUser };
  }

  public async logout(refreshToken: string) {
    const findToken = await this.tokensService.getRefreshToken(refreshToken);
    if (!findToken) throw new HttpException(409, 'Token not found');
    await this.tokensService.updateRefreshToken(findToken.userId);
  }
}
