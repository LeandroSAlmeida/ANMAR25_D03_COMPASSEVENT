import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { CreateSubscriptionDto } from '../../subscription/dto/create-subscription.dto';
import { Subscription } from '../../subscription/entities/subscription.entity';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

@Injectable()
export class CreateSubscription {
  private readonly eventsTable = 'Events';
  private readonly subscriptionsTable = 'Subscriptions';

  async execute(dto: CreateSubscriptionDto): Promise<Subscription> {
    const { userId, eventId } = dto;

    try {
      const eventResult = await docClient.send(
        new GetCommand({
          TableName: this.eventsTable,
          Key: { id: eventId },
        }),
      );

      if (!eventResult.Item) {
        throw new NotFoundException('Event not found.');
      }

      const event = eventResult.Item;

      if (event.status !== 'active') {
        throw new BadRequestException('This event is inactive.');
      }

      const eventDate = new Date(event.date);
      if (eventDate < new Date()) {
        throw new BadRequestException('This event has passed.');
      }

      const existingSubscription = await docClient.send(
        new ScanCommand({
          TableName: this.subscriptionsTable,
          FilterExpression: 'userId = :userId AND eventId = :eventId',
          ExpressionAttributeValues: {
            ':userId': userId,
            ':eventId': eventId,
          },
        }),
      );

      if (existingSubscription.Count && existingSubscription.Count > 0) {
        throw new BadRequestException(
          'You are already subscribed to this event.',
        );
      }

      const now = new Date().toISOString();
      const subscription: Subscription = {
        id: uuidv4(),
        userId,
        eventId,
        createdAt: now,
      };

      await docClient.send(
        new PutCommand({
          TableName: this.subscriptionsTable,
          Item: subscription,
        }),
      );

      return subscription;
    } catch (error) {
      console.error(error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating subscription');
    }
  }
}
