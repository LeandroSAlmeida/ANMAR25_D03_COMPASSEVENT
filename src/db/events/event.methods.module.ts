import { Module } from '@nestjs/common';
import { CreateEvent } from './create-event';
import { UserMethodsModule } from '../users/user.methods.module';
import { UpdateEvent } from './update-event';
import { FindEventById } from './findById-event';
import { FindAllEvents } from './findAll-event';
import { DeleteEvent } from './delete-event';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [UserMethodsModule],
  providers: [
    CreateEvent,
    UpdateEvent,
    FindEventById,
    FindAllEvents,
    DeleteEvent,
    MailModule,
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
