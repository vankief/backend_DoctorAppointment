import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { DoctorTimeSlotEntity } from './doctorTimeSlots.entity';
import { EListTime, Service } from '@/constants';

@Entity()
export class ScheduleDayEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DoctorTimeSlotEntity, doctorTimeSlot => doctorTimeSlot.listTime)
  @JoinColumn({ name: 'doctorTimeSlotId' })
  doctorTimeSlot: Relation<DoctorTimeSlotEntity>;

  @Column({
    type: 'enum',
    enum: Service,
  })
  service: Service;

  @Column({
    type: 'enum',
    enum: EListTime,
  })
  timeSlot: EListTime;

  @Column()
  maximumPatient: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
