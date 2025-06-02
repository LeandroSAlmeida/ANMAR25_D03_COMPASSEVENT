import { Module } from '@nestjs/common';
import { CreateEvent } from './create-event';
import { UserMethodsModule } from '../users/user.methods.module';
import { UpdateEvent } from './update-event';
import { FindEventById } from './findById-event';
import { FindAllEvents } from './findAll-event';

@Module({
  imports: [UserMethodsModule],
  providers: [CreateEvent, UpdateEvent, FindEventById, FindAllEvents],
  exports: [CreateEvent, UpdateEvent, FindEventById, FindAllEvents],
})
export class EventMethodsModule {}
