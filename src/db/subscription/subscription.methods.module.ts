import { Module } from '@nestjs/common';
import { CreateSubscription } from './create-subscription';

@Module({
  imports: [],
  providers: [CreateSubscription],
  exports: [CreateSubscription],
})
export class SubscriptionMethodsModule {}
