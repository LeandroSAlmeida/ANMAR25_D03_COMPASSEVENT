import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CreateSubscription } from 'src/db/subscription/create-subscription';
import { Subscription } from './entities/subscription.entity';
import { ListSubscriptionsByUser } from 'src/db/subscription/listUser-subscription';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly createSubscription: CreateSubscription,
    private readonly listSubscriptionsByUser: ListSubscriptionsByUser,
  ) {}

  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    return this.createSubscription.execute(dto);
  }

  async listByUserId(
    userId: string,
    limit: number,
    lastKey?: string,
  ): Promise<{ data: Subscription[]; nextPageToken?: string }> {
    return this.listSubscriptionsByUser.execute(userId, limit, lastKey);
  }
}
