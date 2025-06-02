import { Module } from '@nestjs/common';
import { CreateEvent } from './create-event';
import { UserMethodsModule } from '../users/user.methods.module';
import { UpdateEvent } from './update-event';
import { FindEventById } from './findById-event';

@Module({
  imports: [UserMethodsModule],
  providers: [CreateEvent, UpdateEvent, FindEventById],
  exports: [CreateEvent, UpdateEvent, FindEventById],
})
export class EventMethodsModule {}
