import { Role } from '@/constants';
import { Auth } from '@/interfaces/auth.interface';
import { AuthUser } from '@/interfaces/authusers.interface';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class AuthEntity extends BaseEntity implements Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @Unique(['email'])
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column()
  userId?: number;

  @Column()
  role: string;
}
