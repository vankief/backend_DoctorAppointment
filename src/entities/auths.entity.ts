import { Role } from '@/constants';
import { Auth } from '@/interfaces/auths.interface';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
export class AuthEntity extends BaseEntity implements Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['email'])
  email: string;

  @Column()
  password: string;

  @Column()
  userId?: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;
}
