import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EventService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() dto: CreateEventDto) {
    try {
      return await this.eventService.createEventService(dto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error creating event',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
