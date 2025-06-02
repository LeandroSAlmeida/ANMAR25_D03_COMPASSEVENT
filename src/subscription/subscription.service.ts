import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CreateSubscription } from 'src/db/subscription/create-subscription';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(private readonly createSubscription: CreateSubscription) {}

  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    return this.createSubscription.execute(dto);
  }
}
