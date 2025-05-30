import { IsNotEmpty, IsString, IsDateString, IsEnum } from 'class-validator';
import { EventStatus } from '../entities/event.entity';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  organizerId: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsEnum(EventStatus)
  status: EventStatus;
}
