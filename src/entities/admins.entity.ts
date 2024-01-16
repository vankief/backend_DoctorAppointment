import { Role } from '@/constants';
import { Admin } from '@/interfaces/admins.interface';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class AdminEntity extends BaseEntity implements Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  @Unique(['email'])
  email: string;

  @Column()
  name: string;
  @Column()
  phoneNumber: string;

  @Column()
  address: string;
}
