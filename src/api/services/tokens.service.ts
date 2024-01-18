import { TokenStoredEntity } from '@/entities/tokenStore.entity';
import { Service } from 'typedi';
import { EntityRepository } from 'typeorm';
@Service()
@EntityRepository()
export class TokensService {
  public async saveRefreshToken(userId: string, refreshToken: string) {
    const token = TokenStoredEntity.create({ userId, token: refreshToken });
    await token.save();
  }

  public async getRefreshToken(userId: string) {
    return await TokenStoredEntity.findOne({ userId });
  }

  public async updateRefreshToken(userId: string) {
    return await TokenStoredEntity.update({ userId }, { isUsed: true });
  }
}
