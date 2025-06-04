import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  UpdateCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import { EventStatus } from '../../events/enums/EventStatus.enum';
import { MailService } from 'src/mail/mail.service';
import { FindUserById } from '../users/findById-user';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

@Injectable()
export class DeleteEvent {
  private readonly tableName = 'Events';
  constructor(
    private readonly mailService: MailService,
    private readonly findUserById: FindUserById,
  ) {}

  async execute(eventId: string) {
    const getEvent = await docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { id: eventId },
      }),
    );

    const event = getEvent.Item;

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.status === EventStatus.INACTIVE) {
      throw new BadRequestException('Event already inactive');
    }

    const now = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { id: eventId },
      UpdateExpression: 'SET #status = :inactive, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':inactive': EventStatus.INACTIVE,
        ':updatedAt': now,
      },
      ReturnValues: 'ALL_NEW',
    });

    const result = await docClient.send(command);
    const updatedEvent = result.Attributes;

    const organizer = await this.findUserById.execute(event.organizerId);

    await this.mailService.sendMail(
      organizer.email,
      'Event deleted',
      `<p> Your event "${event.name}" was deleted</p>`,
    );
    return updatedEvent;
  }
}
