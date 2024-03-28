import { Appointment } from '@/interfaces/appointment.interface';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PatientEntity } from './patient.entity';
import { DoctorEntity } from './doctors.entity';
import { PaymentDetailEntity } from './paymentDetail.entity';
import { EPaymentType } from '@/constants';

@Entity()
export class AppointmentEntity extends BaseEntity implements Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PatientEntity, patient => patient.appointments)
  @JoinColumn({ name: 'patientId' })
  patient: PatientEntity;

  @ManyToOne(() => DoctorEntity, doctor => doctor.appointments)
  @JoinColumn({ name: 'doctorId' })
  doctor: DoctorEntity;

  @OneToOne(() => PaymentDetailEntity, paymentDetail => paymentDetail.appointment)
  @JoinColumn({ name: 'paymentDetailId' })
  paymentDetail: PaymentDetailEntity;

  @Column()
  patientName: String;

  @Column()
  patientPhone: String;

  @Column()
  patientAge: String;

  @Column()
  patientGender: Boolean;

  @Column()
  fee: number;

  @Column()
  reason: String;

  @Column()
  scheduledTime: String;

  @Column()
  scheduledDate: String;

  @Column()
  service: String;

  @Column({
    type: 'enum',
    enum: EPaymentType,
    default: EPaymentType.SMARTCARD,
  })
  paymentType: EPaymentType;

  @Column()
  status: String;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
