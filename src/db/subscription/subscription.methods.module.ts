import { Module } from '@nestjs/common';
import { CreateSubscription } from './create-subscription';
import { ListSubscriptionsByUser } from './listUser-subscription';
import { EventMethodsModule } from '../events/event.methods.module';

@Module({
  imports: [EventMethodsModule],
  providers: [CreateSubscription, ListSubscriptionsByUser],
  exports: [CreateSubscription, ListSubscriptionsByUser],
})
export class SubscriptionMethodsModule {}
