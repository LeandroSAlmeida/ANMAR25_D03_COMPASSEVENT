import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { Injectable, NotFoundException } from '@nestjs/common';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

@Injectable()
export class FindUserById {
  private readonly tableName = 'Users';

  async execute(userId: string) {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id: userId },
    });

    const result = await docClient.send(command);

    if (!result.Item) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = result.Item;

    return userWithoutPassword;
  }
}
