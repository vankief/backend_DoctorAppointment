import { Specialist } from '@/interfaces/specialist.interface';
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
} from 'typeorm';
import { DoctorEntity } from './doctors.entity';

@Entity()
export class SpecialistEntity extends BaseEntity implements Specialist {
  @PrimaryGeneratedColumn('uuid') // UUID được tạo tự động cho mỗi bản ghi mới
  @Unique(['uuid'])
  id?: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => DoctorEntity, doctor => doctor.specialist)
  doctors: Relation<DoctorEntity[]>;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
