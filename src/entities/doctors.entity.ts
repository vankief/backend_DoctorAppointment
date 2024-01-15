import { IsNotEmpty } from 'class-validator';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from '@/interfaces/doctors.interface.';

@Entity()
export class DoctorEntity extends BaseEntity implements Doctor {
  @PrimaryGeneratedColumn('uuid') // UUID được tạo tự động cho mỗi bản ghi mới
  id: string;

  @Column() // Tên của bác sĩ
  name: string;

  @Column()
  @Unique(['email']) // Email của bác sĩ, phải là duy nhất
  email: string;

  @Column() // Địa chỉ của bác sĩ
  address: string;

  @Column() // Đường dẫn đến hình ảnh của bác sĩ
  img: string;

  @Column() // Số điện thoại của bác sĩ
  phone: string;

  @Column() // Giới tính của bác sĩ, true có thể đại diện cho nam và false cho nữ
  gender: boolean;

  @Column() // Ngày sinh của bác sĩ
  dob: string;

  @Column() // Tiểu sử của bác sĩ
  biography: string;

  @Column() // Giá cho dịch vụ của bác sĩ
  price: number;

  @Column() // Dịch vụ mà bác sĩ cung cấp
  services: string;

  @Column() // Chuyên môn của bác sĩ
  specialization: string;

  @Column() // Bằng cấp của bác sĩ
  degree: string;

  @Column() // Trường đại học mà bác sĩ đã theo học
  college: string;

  @Column() // Năm bác sĩ hoàn thành bằng cấp
  completionYear: string;

  @Column() // Kinh nghiệm làm việc của bác sĩ
  experience: string;

  @Column() // Chức vụ của bác sĩ
  designation: string;

  @Column() // Các giải thưởng mà bác sĩ đã nhận được
  awards: string;

  @Column() // Số đăng ký hành nghề của bác sĩ
  registration: string;

  @Column() // Có thể là năm bắt đầu hành nghề hoặc năm đăng ký hành nghề
  year: string;

  @Column()
  @CreateDateColumn() // Ngày tạo bản ghi
  createdAt: Date;

  @Column()
  @UpdateDateColumn() // Ngày cập nhật bản ghi cuối cùng
  updatedAt: Date;
}
