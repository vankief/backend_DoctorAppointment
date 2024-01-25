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
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { DoctorTimeSlot } from '@/interfaces/doctors.interface.';
import { ScheduleDayEntity } from './scheduleDay.entity';

@Entity()
export class DoctorTimeSlotEntity extends BaseEntity implements DoctorTimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DoctorEntity, doctor => doctor.timeSlots)
  @JoinColumn({ name: 'doctorId' })
  doctor: Relation<DoctorEntity>; // And here

  @Column()
  day: string;

  @Column({ default: false })
  isPublic: boolean;

  @OneToMany(() => ScheduleDayEntity, scheduleDay => scheduleDay.doctorTimeSlot, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  listTime: Relation<ScheduleDayEntity[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
