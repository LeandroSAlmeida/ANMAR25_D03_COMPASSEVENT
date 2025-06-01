import { ForbiddenException, Injectable } from '@nestjs/common';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { CreateEventDto } from 'src/events/dto/create-event.dto';
import { Event } from 'src/events/entities/event.entity';
import { FindUserById } from '../users/findById-user';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

@Injectable()
export class CreateEvent {
  private readonly tableName = 'Events';

  constructor(private readonly findUserById: FindUserById) {}

  async execute(dto: CreateEventDto): Promise<Event> {
    const organizer = await this.findUserById.execute(dto.organizerId);

    if (organizer.role !== 'organizador') {
      throw new ForbiddenException('Only organizador can create events.');
    }

    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const event = new Event({
      id,
      name: dto.name,
      description: dto.description,
      date: dto.date,
      organizerId: dto.organizerId,
      imageUrl: dto.imageUrl,
      status: dto.status,
      createdAt,
    });

    await docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: event,
      }),
    );

    return event;
  }
}
