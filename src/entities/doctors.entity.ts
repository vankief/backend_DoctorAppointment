import { IsNotEmpty } from 'class-validator';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Relation,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Doctor } from '@/interfaces/doctors.interface.';
import { DoctorTimeSlotEntity } from './doctorTimeSlots.entity';
import { AppointmentEntity } from './appointment.entity';
import { SpecialistEntity } from './specialist.entity';

@Entity()
export class DoctorEntity extends BaseEntity implements Doctor {
  @PrimaryGeneratedColumn('uuid') // UUID được tạo tự động cho mỗi bản ghi mới
  @Unique(['id']) // ID của bác sĩ, phải là duy nhất
  id: string;

  @Column() // Tên của bác sĩ
  name: string;

  @Column()
  @Unique(['email']) // Email của bác sĩ, phải là duy nhất
  email: string;

  @Column() // Địa chỉ của bác sĩ
  address: string;

  @Column({ nullable: true }) // Đường dẫn đến hình ảnh của bác sĩ
  img?: string;

  @Column() // Số điện thoại của bác sĩ
  phone: string;

  @Column() // Giới tính của bác sĩ, true có thể đại diện cho nam và false cho nữ
  gender: boolean;

  @Column() // Ngày sinh của bác sĩ
  dob: string;

  @Column({ nullable: true }) // Giá cho dịch vụ của bác sĩ
  price: number;

  @Column({ nullable: true }) // Dịch vụ mà bác sĩ cung cấp
  services: string;

  @Column({ nullable: true }) // Bằng cấp của bác sĩ
  degree: string;

  @Column({ nullable: true }) // Trường đại học mà bác sĩ đã theo học
  college: string;

  @Column({ nullable: true }) // Kinh nghiệm làm việc của bác sĩ
  experience: string;

  @Column({ nullable: true }) // Chức vụ của bác sĩ
  designation: string;

  @Column({ nullable: true }) // Các giải thưởng mà bác sĩ đã nhận được
  awards: string;

  @OneToMany(() => DoctorTimeSlotEntity, doctorTimeSlot => doctorTimeSlot.doctor)
  timeSlots: Relation<DoctorTimeSlotEntity[]>;

  @OneToMany(() => AppointmentEntity, appointment => appointment.doctor)
  appointments: Relation<AppointmentEntity[]>;

  @ManyToOne(() => SpecialistEntity, specialist => specialist.doctors)
  @JoinColumn({ name: 'specialistId' })
  specialist: SpecialistEntity;

  @Column()
  @CreateDateColumn() // Ngày tạo bản ghi
  createdAt: Date;

  @Column()
  @UpdateDateColumn() // Ngày cập nhật bản ghi cuối cùng
  updatedAt: Date;
}
