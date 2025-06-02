import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Event } from '../../events/entities/event.entity';

@Injectable()
export class FindEventById {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly tableName = 'Events';

  constructor() {
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client);
  }

  async execute(eventId: string): Promise<Event> {
    try {
      const result = await this.docClient.send(
        new GetCommand({
          TableName: this.tableName,
          Key: { id: eventId },
        }),
      );

      if (!result.Item) {
        throw new NotFoundException(`Event id ${eventId} not Found`);
      }

      return result.Item as Event;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Error searching for event.');
    }
  }
}
