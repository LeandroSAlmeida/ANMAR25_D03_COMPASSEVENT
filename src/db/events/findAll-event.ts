import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { Event } from '../../events/entities/event.entity';

@Injectable()
export class FindAllEvents {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly tableName = 'Events';

  constructor() {
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client);
  }

  async execute(query: {
    name?: string;
    date?: string;
    dateDirection?: 'before' | 'after';
    status?: string;
    limit?: number;
    lastKey?: string;
  }): Promise<{
    items: Event[];
    lastKey?: string;
    limit: number;
    currentPage?: number;
    hasMore: boolean;
  }> {
    try {
      const { name, date, dateDirection, status, limit = 10, lastKey } = query;

      const params: ScanCommandInput = {
        TableName: this.tableName,
        Limit: limit,
      };

      const filterExpressions: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};

      if (status) {
        filterExpressions.push('#status = :status');
        expressionAttributeNames['#status'] = 'status';
        expressionAttributeValues[':status'] = status.toLowerCase();
      }

      if (filterExpressions.length > 0) {
        params.FilterExpression = filterExpressions.join(' AND ');
        params.ExpressionAttributeNames = expressionAttributeNames;
        params.ExpressionAttributeValues = expressionAttributeValues;
      }

      if (lastKey) {
        params.ExclusiveStartKey = { id: lastKey };
      }

      const result = await this.docClient.send(new ScanCommand(params));

      let items: Event[] = (result.Items as Event[]) || [];

      if (name) {
        items = items.filter((e) =>
          e.name?.toLowerCase().includes(name.toLowerCase()),
        );
      }

      if (date && dateDirection) {
        const targetDate = new Date(date).toISOString();
        items = items.filter((e) => {
          const eventDate = new Date(e.date).toISOString();
          return dateDirection === 'before'
            ? eventDate < targetDate
            : eventDate > targetDate;
        });
      }

      const lastEvaluatedKey = result.LastEvaluatedKey?.id as
        | string
        | undefined;

      return {
        items,
        limit,
        currentPage: lastKey ? undefined : 1,
        hasMore: !!result.LastEvaluatedKey,
        lastKey: lastEvaluatedKey,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error fetching paginated events.',
      );
    }
  }
}
