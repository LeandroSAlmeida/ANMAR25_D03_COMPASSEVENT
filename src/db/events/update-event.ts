import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import {
  GetCommand,
  UpdateCommand,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateEventDto } from 'src/events/dto/update-event.dto';
import { Event } from 'src/events/entities/event.entity';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

@Injectable()
export class UpdateEvent {
  private readonly tableName = 'Events';

  async execute(eventId: string, dto: UpdateEventDto): Promise<Event> {
    const getResponse = await docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { id: eventId },
      }),
    );

    const existingEvent = getResponse.Item;

    if (!existingEvent) {
      throw new NotFoundException('Event not found');
    }

    const updatedAt = new Date().toISOString();
    const data = { ...dto, updatedAt };

    const keys = Object.keys(data).filter((key) => data[key] !== undefined);

    if (keys.length === 0) {
      throw new BadRequestException('At least one field must be provided');
    }

    const updateExpression =
      'set ' + keys.map((k) => `#${k} = :${k}`).join(', ');
    const ExpressionAttributeNames = Object.fromEntries(
      keys.map((k) => [`#${k}`, k]),
    );
    const ExpressionAttributeValues = Object.fromEntries(
      keys.map((k) => [`:${k}`, data[k]]),
    );

    try {
      const updateResponse = await docClient.send(
        new UpdateCommand({
          TableName: this.tableName,
          Key: { id: eventId },
          UpdateExpression: updateExpression,
          ExpressionAttributeNames,
          ExpressionAttributeValues,
          ReturnValues: 'ALL_NEW',
        }),
      );

      return updateResponse.Attributes as Event;
    } catch (error) {
      console.error('Update error:', error);
      throw new InternalServerErrorException('Failed to update event');
    }
  }
}
