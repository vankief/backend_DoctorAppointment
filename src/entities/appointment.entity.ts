import { Appointment } from '@/interfaces/appointment.interface';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PatientEntity } from './patient.entity';
import { DoctorEntity } from './doctors.entity';

@Entity()
export class AppointmentEntity extends BaseEntity implements Appointment {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => PatientEntity, patient => patient.appointments)
  @JoinColumn({ name: 'patientId' })
  patient: PatientEntity;

  @ManyToOne(() => DoctorEntity, doctor => doctor.appointments)
  @JoinColumn({ name: 'doctorId' })
  doctor: DoctorEntity;

  @Column()
  reason: string;

  @Column()
  scheduledTime: string;

  @Column()
  scheduledDate: string;

  @Column()
  paymentType: string;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
