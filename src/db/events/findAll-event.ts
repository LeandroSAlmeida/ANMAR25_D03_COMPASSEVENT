import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  DynamoDBClient,
  ScanCommand,
  AttributeValue,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
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

      if (lastKey) {
        params.ExclusiveStartKey = { id: { S: lastKey } };
      }

      const result = await this.docClient.send(new ScanCommand(params));

      const items: Event[] = (result.Items || []).map(
        (item) => unmarshall(item as Record<string, AttributeValue>) as Event,
      );
      let filteredItems = items;

      if (name) {
        filteredItems = filteredItems.filter((e) =>
          e.name.toLowerCase().includes(name.toLowerCase()),
        );
      }

      if (date && dateDirection) {
        const targetDate = new Date(date).toISOString();
        filteredItems = filteredItems.filter((e) => {
          const eventDate = new Date(e.date).toISOString();
          return dateDirection === 'before'
            ? eventDate < targetDate
            : eventDate > targetDate;
        });
      }

      if (status) {
        filteredItems = filteredItems.filter(
          (e) => e.status?.toLowerCase() === status.toLowerCase(),
        );
      }

      const lastEvaluatedKey = result.LastEvaluatedKey?.id?.S ?? undefined;

      return {
        items,
        limit,
        currentPage: lastKey ? undefined : 1,
        hasMore: !!result.LastEvaluatedKey,
        lastKey: result.LastEvaluatedKey?.id as unknown as string,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching paginated events.',
      );
    }
  }
}
