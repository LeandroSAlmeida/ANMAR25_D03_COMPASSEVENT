import { Module } from '@nestjs/common';
import { CreateSubscription } from './create-subscription';
import { ListSubscriptionsByUser } from './listUser-subscription';
import { EventMethodsModule } from '../events/event.methods.module';
import { DeleteSubscription } from './delete-subscription';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [EventMethodsModule, MailModule],
  providers: [CreateSubscription, ListSubscriptionsByUser, DeleteSubscription],
  exports: [CreateSubscription, ListSubscriptionsByUser, DeleteSubscription],
})
export class SubscriptionMethodsModule {}
