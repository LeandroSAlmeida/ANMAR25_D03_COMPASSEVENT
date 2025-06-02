import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateEvent } from 'src/db/events/create-event';
import { AwsS3Service } from 'src/aws/s3.service';
import { FindUserById } from 'src/db/users/findById-user';
import { UpdateEvent } from 'src/db/events/update-event';
import { UpdateEventDto } from './dto/update-event.dto';
import { FindEventById } from 'src/db/events/findById-event';
import { FindAllEvents } from 'src/db/events/findAll-event';
import { DeleteEvent } from 'src/db/events/delete-event';

@Injectable()
export class EventService {
  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly createEvent: CreateEvent,
    private readonly findUserById: FindUserById,
    private readonly updateEvent: UpdateEvent,
    private readonly findEventById: FindEventById,
    private readonly findAllEvents: FindAllEvents,
    private readonly deleteEvent: DeleteEvent,
  ) {}

  async createEventService(dto: CreateEventDto) {
    const createEventDto = plainToInstance(CreateEventDto, dto);

    const errors = await validate(createEventDto);
    if (errors.length > 0) {
      throw new Error('Validation failed: ' + JSON.stringify(errors));
    }

    const organizer = await this.findUserById.execute(dto.organizerId);
    if (!organizer) {
      throw new Error('Organizer not found.');
    }

    if (dto.imageUrl) {
      let buffer: Buffer;
      let mimeType: string;
      let fileExtension: string;

      const match = dto.imageUrl.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        const base64Data = match[2];
        buffer = Buffer.from(base64Data, 'base64');
        fileExtension = mimeType.split('/')[1];
      } else {
        buffer = Buffer.from(dto.imageUrl, 'base64');
        mimeType = 'application/octet-stream';
        fileExtension = 'bin';
      }

      const fileName = `event-${Date.now()}.${fileExtension}`;
      const uploadedUrl = await this.awsS3Service.uploadFile(
        buffer,
        fileName,
        mimeType,
      );

      createEventDto.imageUrl = uploadedUrl;
    }

    const newEvent = await this.createEvent.execute(createEventDto);
    return newEvent;
  }

  async update(eventId: string, dto: UpdateEventDto) {
    return this.updateEvent.execute(eventId, dto);
  }

  async findById(eventId: string) {
    return this.findEventById.execute(eventId);
  }

  async getAll(query: {
    name?: string;
    date?: string;
    dateDirection?: 'before' | 'after';
    status?: string;
    limit?: number;
    lastKey?: string;
  }) {
    return this.findAllEvents.execute(query);
  }

  async softDeleteEvent(eventId: string) {
    return await this.deleteEvent.execute(eventId);
  }
}
