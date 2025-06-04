import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionMethodsModule } from 'src/db/subscription/subscription.methods.module';

@Module({
  imports: [SubscriptionMethodsModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
