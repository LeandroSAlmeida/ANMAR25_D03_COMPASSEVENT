import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventController } from './events.controller';
import { EventMethodsModule } from 'src/db/events/event.methods.module';
import { S3Module } from 'src/aws/s3.module';
import { DbModule } from 'src/db/db.module';
import { UserMethodsModule } from 'src/db/users/user.methods.module';

@Module({
  imports: [EventMethodsModule, DbModule, S3Module, UserMethodsModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventsModule {}
