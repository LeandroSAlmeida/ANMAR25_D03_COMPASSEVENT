import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateEvent } from 'src/db/events/create-event';
import { AwsS3Service } from 'src/aws/s3.service';
import { FindUserById } from 'src/db/users/findById-user';

@Injectable()
export class EventService {
  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly createEvent: CreateEvent,
    private readonly findUserById: FindUserById,
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
}
