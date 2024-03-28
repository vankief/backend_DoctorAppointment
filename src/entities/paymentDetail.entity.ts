import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { AppointmentEntity } from './appointment.entity';
import { PaymentDetail } from '@/interfaces/paymentDetail.interface';
import { EPaymentStatus } from '@/constants';

@Entity()
export class PaymentDetailEntity extends BaseEntity implements PaymentDetail {
  @PrimaryGeneratedColumn('uuid')
  id: String;

  @OneToOne(() => AppointmentEntity, appointment => appointment.paymentDetail)
  @JoinColumn({ name: 'appointmentId' })
  appointment: AppointmentEntity;

  @Column({
    type: 'enum',
    enum: EPaymentStatus,
    default: EPaymentStatus.PENDING,
  })
  paymentStatus: EPaymentStatus;

  @Column()
  amountPad: Number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
