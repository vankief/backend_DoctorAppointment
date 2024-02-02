import { IsNotEmpty } from 'class-validator';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { Patient } from '@/interfaces/patients.interface';
import { AppointmentEntity } from './appointment.entity';

@Entity()
export class PatientEntity extends BaseEntity implements Patient {
  @PrimaryGeneratedColumn('uuid') // UUID được tạo tự động cho mỗi bản ghi mới
  @Unique(['uuid'])
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  @Unique(['email'])
  email: string;

  @Column()
  @IsNotEmpty()
  address: string;

  @Column()
  img?: string;

  @Column()
  @IsNotEmpty()
  phone: string;

  @Column()
  @IsNotEmpty()
  gender: boolean;

  @Column()
  @IsNotEmpty()
  dob: string;

  @OneToMany(() => AppointmentEntity, appointment => appointment.patient)
  appointments: Relation<AppointmentEntity[]>;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
