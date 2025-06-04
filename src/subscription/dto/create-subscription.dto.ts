import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSubscriptionDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'd694c49b-8a92-499f-8cbf-145db52b15b3' })
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'd694c49b-8a92-499f-8cbf-145db52b15b3' })
  eventId: string;
}
