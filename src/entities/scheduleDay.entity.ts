import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DoctorTimeSlotEntity } from './doctorTimeSlots.entity';
@Entity()
export class ScheduleDayEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @ManyToOne(() => DoctorTimeSlotEntity, doctorTimeSlot => doctorTimeSlot.timeSlot)
  doctorTimeSlot: DoctorTimeSlotEntity;

  @Column()
  doctorTimeSlotId: string;
}
