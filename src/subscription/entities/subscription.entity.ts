export class Subscription {
  id: string;
  userId: string;
  eventId: string;
  createdAt: string;
  deletedAt?: string;

  constructor(partial: Partial<Subscription>) {
    Object.assign(this, partial);
  }
}
