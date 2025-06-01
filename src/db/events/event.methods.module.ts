import { Module } from '@nestjs/common';
import { CreateEvent } from './create-event';
import { UserMethodsModule } from '../users/user.methods.module';

@Module({
  imports: [UserMethodsModule],
  providers: [CreateEvent],
  exports: [CreateEvent],
})
export class EventMethodsModule {}
