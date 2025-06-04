import { SubscriptionStatus } from '../enums/SubscriptionStatus.enum';

export class Subscription {
  id: string;
  userId: string;
  eventId: string;
  status: SubscriptionStatus;
  createdAt: string;
  deletedAt?: string;

  constructor(partial: Partial<Subscription>) {
    Object.assign(this, partial);
  }
}
