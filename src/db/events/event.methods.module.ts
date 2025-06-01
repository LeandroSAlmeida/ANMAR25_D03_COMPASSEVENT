import { Module } from '@nestjs/common';
import { CreateEvent } from './create-event';
import { UserMethodsModule } from '../users/user.methods.module';
import { UpdateEvent } from './update-event';

@Module({
  imports: [UserMethodsModule],
  providers: [CreateEvent, UpdateEvent],
  exports: [CreateEvent, UpdateEvent],
})
export class EventMethodsModule {}
