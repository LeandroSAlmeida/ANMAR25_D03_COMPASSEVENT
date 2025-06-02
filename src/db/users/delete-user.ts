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

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

@Injectable()
export class DeleteUser {
  private readonly tableName = 'Users';

  async execute(userId: string) {
    const getUser = await docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { id: userId },
      }),
    );

    const user = getUser.Item;

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    if (user.isActive === 0) {
      throw new BadRequestException('User already deleted');
    }

    const now = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { id: userId },
      UpdateExpression: 'SET #isActive = :isActive, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#isActive': 'isActive',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':isActive': 0,
        ':updatedAt': now,
      },
      ReturnValues: 'ALL_NEW',
    });

    const result = await docClient.send(command);
    const updatedUser = result.Attributes;

    if (updatedUser && updatedUser.password) {
      delete updatedUser.password;
    }

    return updatedUser;
  }
}
