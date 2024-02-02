import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  reason: string;

  @IsNotEmpty()
  @IsDateString()
  scheduledDate: string;

  @IsNotEmpty()
  scheduledTime: string;

  @IsNotEmpty()
  paymentType: string;
}
