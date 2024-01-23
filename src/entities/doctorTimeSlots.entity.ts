import { DoctorEntity } from '@/entities/doctors.entity'; // Update this import
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DoctorTimeSlot } from '@/interfaces/doctors.interface.';
import { ScheduleDay } from './scheduleDay.entity';

@Entity()
export class DoctorTimeSlotEntity extends BaseEntity implements DoctorTimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DoctorEntity, doctor => doctor.timeSlots)
  @JoinColumn({ name: 'doctorId' })
  doctor: DoctorEntity; // And here

  @Column()
  day: string;

  @OneToMany(() => ScheduleDay, scheduleDay => scheduleDay.doctorTimeSlot, { eager: true })
  listTime: ScheduleDay[];

  @Column({ nullable: true })
  maximumPatient: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
