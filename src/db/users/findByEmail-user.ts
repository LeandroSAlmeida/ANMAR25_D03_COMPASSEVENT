import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { Injectable, NotFoundException } from '@nestjs/common';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

@Injectable()
export class FindUserByEmail {
  private readonly tableName = 'Users';

  async execute(email: string) {
    const params: ScanCommandInput = {
      TableName: this.tableName,
      FilterExpression: '#email = :email',
      ExpressionAttributeNames: {
        '#email': 'email',
      },
      ExpressionAttributeValues: {
        ':email': email.trim(),
      },
      Limit: 1,
    };

    const result = await docClient.send(
      new ScanCommand({ TableName: this.tableName }),
    );

    if (!result.Items || result.Items.length === 0) {
      throw new NotFoundException('User not found');
    }

    return result.Items[0];
  }
}
