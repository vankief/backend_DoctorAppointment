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
  OneToOne,
} from 'typeorm';
import { Patient } from '@/interfaces/patients.interface';
import { AppointmentEntity } from './appointment.entity';
import { ReviewEntity } from './review.entity';

@Entity()
export class PatientEntity extends BaseEntity implements Patient {
  @PrimaryGeneratedColumn('uuid') // UUID được tạo tự động cho mỗi bản ghi mới
  @Unique(['uuid'])
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  @Unique(['email'])
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  img?: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  gender: boolean;

  @Column({ nullable: true })
  dob: string;

  @OneToMany(() => AppointmentEntity, appointment => appointment.patient)
  appointments: Relation<AppointmentEntity[]>;

  @OneToOne(() => ReviewEntity, review => review.patient)
  review: ReviewEntity;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
