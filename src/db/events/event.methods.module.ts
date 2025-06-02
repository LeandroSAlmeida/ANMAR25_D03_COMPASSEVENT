import { Module } from '@nestjs/common';
import { CreateEvent } from './create-event';
import { UserMethodsModule } from '../users/user.methods.module';
import { UpdateEvent } from './update-event';
import { FindEventById } from './findById-event';
import { FindAllEvents } from './findAll-event';
import { DeleteEvent } from './delete-event';

@Module({
  imports: [UserMethodsModule],
  providers: [
    CreateEvent,
    UpdateEvent,
    FindEventById,
    FindAllEvents,
    DeleteEvent,
  ],
  exports: [
    CreateEvent,
    UpdateEvent,
    FindEventById,
    FindAllEvents,
    DeleteEvent,
  ],
})
export class EventMethodsModule {}
