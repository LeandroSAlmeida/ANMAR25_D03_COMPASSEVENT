import { EventStatus } from '../enums/EventStatus.enum';

export class Event {
  id: string;
  name: string;
  description: string;
  date: string;
  organizerId: string;
  imageUrl: string;
  status: EventStatus;
  createdAt: string;
  updatedAt?: string;

  constructor(partial: Partial<Event>) {
    Object.assign(this, partial);
  }
}
export { EventStatus };
