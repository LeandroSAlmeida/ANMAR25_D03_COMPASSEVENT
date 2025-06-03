import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { SubscriptionStatus } from '../../subscription/enums/SubscriptionStatus.enum';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

@Injectable()
export class DeleteSubscription {
  private readonly tableName = 'Subscriptions';

  async execute(userId: string, eventId: string) {
    const result = await docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { userId, eventId },
      }),
    );

    const subscription = result.Item;
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status === SubscriptionStatus.INACTIVE) {
      throw new BadRequestException('Subscription already inactive');
    }

    const now = new Date().toISOString();

    const updateResult = await docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { userId, eventId },
        UpdateExpression: 'SET #status = :status, #deletedAt = :deletedAt',
        ExpressionAttributeNames: {
          '#status': 'status',
          '#deletedAt': 'deletedAt',
        },
        ExpressionAttributeValues: {
          ':status': SubscriptionStatus.INACTIVE,
          ':deletedAt': now,
        },
        ReturnValues: 'ALL_NEW',
      }),
    );

    return updateResult.Attributes;
  }
}
