import {
  DynamoDBClient,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/client-dynamodb';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Subscription } from '../../subscription/entities/subscription.entity';
import { FindEventById } from '../events/findById-event';
import { SubscriptionStatus } from 'src/subscription/enums/SubscriptionStatus.enum';

const client = new DynamoDBClient({});

@Injectable()
export class ListSubscriptionsByUser {
  private readonly subscriptionsTable = 'Subscriptions';

  constructor(private readonly findEventById: FindEventById) {}

  async execute(
    userId: string,
    limit: number,
    lastKey?: string,
  ): Promise<{
    data: (Subscription & { eventName: string })[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    nextPageToken?: string;
    hasMore: boolean;
  }> {
    try {
      const exclusiveStartKey = lastKey ? JSON.parse(lastKey) : undefined;
      const currentPage = exclusiveStartKey?.__page
        ? exclusiveStartKey.__page + 1
        : 1;

      const totalScanParams: ScanCommandInput = {
        TableName: this.subscriptionsTable,
        FilterExpression: 'userId = :uid',
        ExpressionAttributeValues: {
          ':uid': { S: userId },
        },
        Select: 'COUNT',
      };

      const totalResult = await client.send(new ScanCommand(totalScanParams));
      const total = totalResult.Count || 0;
      const totalPages = Math.max(Math.ceil(total / limit), 1);

      const scanParams: ScanCommandInput = {
        TableName: this.subscriptionsTable,
        FilterExpression: 'userId = :uid',
        ExpressionAttributeValues: {
          ':uid': { S: userId },
        },
        Limit: limit,
        ExclusiveStartKey: exclusiveStartKey,
      };

      const result = await client.send(new ScanCommand(scanParams));

      const subscriptions = (result.Items || []).map((item) => ({
        id: item.id.S || '',
        userId: item.userId.S || '',
        eventId: item.eventId.S || '',
        createdAt: item.createdAt.S || '',
        status:
          (item.status?.S as SubscriptionStatus) || SubscriptionStatus.ACTIVE,
      }));

      const subscriptionsWithName = await Promise.all(
        subscriptions.map(async (sub) => {
          const event = await this.findEventById.execute(sub.eventId);
          return {
            ...sub,
            eventName: event.name,
          };
        }),
      );

      const hasMore = !!result.LastEvaluatedKey;
      const nextPageToken = hasMore
        ? JSON.stringify({ ...result.LastEvaluatedKey, __page: currentPage })
        : undefined;

      return {
        data: subscriptionsWithName,
        pagination: {
          page: currentPage,
          limit,
          total,
          totalPages,
        },
        nextPageToken,
        hasMore,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to list subscriptions');
    }
  }
}
