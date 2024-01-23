import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DoctorTimeSlotEntity } from './doctorTimeSlots.entity';
import { ListTime } from '@/constants';

@Entity()
export class ScheduleDay extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DoctorTimeSlotEntity, doctorTimeSlot => doctorTimeSlot.listTime)
  @JoinColumn({ name: 'doctorTimeSlotId' })
  doctorTimeSlot: DoctorTimeSlotEntity;

  @Column({
    type: 'enum',
    enum: ListTime,
  })
  timeSlot: ListTime;

  @Column({ nullable: true })
  maximumPatient: number;

  @Column({ default: false })
  isPublic: boolean;

  @Column()
  doctorId: string;

  @Column()
  CreatedAt: Date;

  @Column()
  UpdatedAt: Date;
}
