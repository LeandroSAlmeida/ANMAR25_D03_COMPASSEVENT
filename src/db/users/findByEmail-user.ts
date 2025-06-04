import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

@Injectable()
export class FindUserByEmail {
  private readonly tableName = 'Users';

  async execute(email: string): Promise<User> {
    let ExclusiveStartKey;
    let user: User | undefined;

    do {
      const result = await docClient.send(
        new ScanCommand({
          TableName: this.tableName,
          ExclusiveStartKey,
        }),
      );

      user = result.Items?.find((item) => item.email === email.trim()) as User;

      if (user) break;

      ExclusiveStartKey = result.LastEvaluatedKey;
    } while (ExclusiveStartKey);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
