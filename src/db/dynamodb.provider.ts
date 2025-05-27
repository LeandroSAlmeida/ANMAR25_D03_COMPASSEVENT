import * as dotenv from 'dotenv';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

dotenv.config();

export const DynamoDBProvider = {
  provide: 'DYNAMO_DB_CLIENT',
  useFactory: () => {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    return DynamoDBDocumentClient.from(client);
  },
};
