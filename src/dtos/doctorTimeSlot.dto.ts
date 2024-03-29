import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class DoctorTimeSlotDTO {
  @IsNotEmpty()
  @IsDateString()
  day: string;

  @IsArray()
  @IsOptional()
  timeSlot: { startTime: string; endTime: string }[];

  @IsOptional()
  @IsNumber()
  maximumPatient?: number;
}
