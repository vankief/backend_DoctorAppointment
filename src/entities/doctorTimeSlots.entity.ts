import { DoctorEntity } from '@/entities/doctors.entity'; // Update this import
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ScheduleDayEntity } from './scheduleDay.entity';
import { DoctorTimeSlot } from '@/interfaces/doctors.interface.';

@Entity()
export class DoctorTimeSlotEntity extends BaseEntity implements DoctorTimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DoctorEntity, doctor => doctor.timeSlots)
  doctor: DoctorEntity; // And here

  @Column()
  day: Date;

  @OneToMany(() => ScheduleDayEntity, scheduleDay => scheduleDay.doctorTimeSlot)
  timeSlot: ScheduleDayEntity[];

  @Column({ nullable: true })
  maximumPatient: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
