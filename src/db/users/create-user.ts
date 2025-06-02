import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { User } from '../../users/entities/user.entity';
import { UserStatus } from '../../users/enums/userStatus.enum';
import { UserRole } from '../../users/enums/userRole.enum';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

@Injectable()
export class CreateUser {
  private readonly tableName = 'Users';

  async execute(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const emailCheck = await docClient.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: '#email = :email',
        ExpressionAttributeNames: {
          '#email': 'email',
        },
        ExpressionAttributeValues: {
          ':email': dto.email,
        },
      }),
    );

    if (emailCheck.Items && emailCheck.Items.length > 0) {
      throw new Error('E-mail already in use.');
    }

    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const createdAt = new Date().toISOString();

    const user = new User({
      id,
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      phone: dto.phone,
      profileImageUrl: dto.profileImageUrl || '',
      createdAt,
      isActive: dto.isActive ?? UserStatus.active,
      role: dto.role ?? UserRole.PARTICIPANTE,
    });

    await docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: user,
      }),
    );

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
