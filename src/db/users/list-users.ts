import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { UserStatus } from '../../users/enums/userStatus.enum';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

@Injectable()
export class ListUsers {
  private readonly tableName = 'Users';

  async execute(
    filters: {
      name?: string;
      email?: string;
      role?: string;
      isActive?: UserStatus;
    },
    pagination: { limit?: number; page?: number },
  ) {
    const { name, email, role, isActive } = filters;
    const limit = pagination.limit ?? 10;
    const page = pagination.page ?? 1;

    const filterExpressionParts: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    if (name) {
      filterExpressionParts.push('contains(#name, :name)');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = name;
    }

    if (email) {
      filterExpressionParts.push('contains(#email, :email)');
      expressionAttributeNames['#email'] = 'email';
      expressionAttributeValues[':email'] = email;
    }

    if (role) {
      filterExpressionParts.push('#role = :role');
      expressionAttributeNames['#role'] = 'role';
      expressionAttributeValues[':role'] = role.toLowerCase();
    }

    if (isActive !== undefined) {
      filterExpressionParts.push('#isActive = :isActive');
      expressionAttributeNames['#isActive'] = 'isActive';
      expressionAttributeValues[':isActive'] = isActive;
    }

    const params = {
      TableName: this.tableName,
      FilterExpression: filterExpressionParts.length
        ? filterExpressionParts.join(' AND ')
        : undefined,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length
        ? expressionAttributeNames
        : undefined,
      ExpressionAttributeValues: Object.keys(expressionAttributeValues).length
        ? expressionAttributeValues
        : undefined,
    };

    const scanResult = await docClient.send(new ScanCommand(params));
    const allUsers = scanResult.Items ?? [];

    if (isActive !== undefined && allUsers.length === 0) {
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }

    const total = allUsers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedUsers = allUsers.slice(startIndex, startIndex + limit);

    const data = paginatedUsers.map(({ password, ...user }) => user);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
