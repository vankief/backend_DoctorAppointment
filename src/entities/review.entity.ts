import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PatientEntity } from './patient.entity';
import { DoctorEntity } from './doctors.entity';

@Entity()
export class ReviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  review: string;

  @Column()
  rating: number;

  @OneToOne(() => PatientEntity, patient => patient.review)
  @JoinColumn({ name: 'patientId' })
  patient: PatientEntity;

  @ManyToOne(() => DoctorEntity, doctor => doctor.reviews)
  @JoinColumn({ name: 'doctorId' })
  doctor: DoctorEntity;

  @Column()
  @CreateDateColumn() // Ngày tạo bản ghi
  createdAt: Date;

  @Column()
  @UpdateDateColumn() // Ngày cập nhật bản ghi cuối cùng
  updatedAt: Date;
}
