import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { SubscriptionStatus } from '../enums/SubscriptionStatus.enum';

export class CreateSubscriptionDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;
}
