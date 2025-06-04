import { IsNotEmpty, IsString, IsDateString, IsEnum } from 'class-validator';
import { EventStatus } from '../entities/event.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Leandro Souza' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'there is description' })
  description: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2025-06-04T12:00:00.000Z',
    type: String,
    format: 'date-time',
    description: 'Date form ISO 8601',
  })
  date: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'fac6a9c9-56de-47d1-8bf0-95c3562a4ad6' })
  organizerId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'fac6a9c9-56de-47d1-8bf0-95c3562a4ad6' })
  imageUrl: string;
  @ApiProperty({ enum: EventStatus })
  @IsEnum(EventStatus)
  status: EventStatus;
}
