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
import { DoctorTimeSlotEntity } from './doctorTimeSlots.entity';
import { EListTime } from '@/constants';

@Entity()
export class ScheduleDay extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DoctorTimeSlotEntity, doctorTimeSlot => doctorTimeSlot.listTime)
  @JoinColumn({ name: 'doctorTimeSlotId' })
  doctorTimeSlot: DoctorTimeSlotEntity;

  @Column({
    type: 'enum',
    enum: EListTime,
  })
  timeSlot: EListTime;

  @Column()
  maximumPatient: number;

  @Column({ default: false })
  isPublic: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
