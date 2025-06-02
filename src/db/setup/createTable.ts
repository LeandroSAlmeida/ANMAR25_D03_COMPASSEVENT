import {
  CreateTableCommand,
  CreateTableInput,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
import { ddbClient } from '../libs/ddbClients';

const TABLES: { name: string; params: CreateTableInput }[] = [
  {
    name: 'Users',
    params: {
      TableName: 'Users',
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      StreamSpecification: {
        StreamEnabled: false,
      },
    },
  },
  {
    name: 'Events',
    params: {
      TableName: 'Events',
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      StreamSpecification: {
        StreamEnabled: false,
      },
    },
  },
  {
    name: 'Subscriptions',
    params: {
      TableName: 'Subscriptions',
      KeySchema: [
        { AttributeName: 'userId', KeyType: 'HASH' },
        { AttributeName: 'eventId', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'userId', AttributeType: 'S' },
        { AttributeName: 'eventId', AttributeType: 'S' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      StreamSpecification: {
        StreamEnabled: false,
      },
    },
  },
];

const waitForTableToBeActive = async (tableName: string, timeout = 30000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const result = await ddbClient.send(
        new DescribeTableCommand({ TableName: tableName }),
      );
      if (result.Table?.TableStatus === 'ACTIVE') {
        return true;
      }
    } catch (e) {
      console.log(e);
    }
    await new Promise((res) => setTimeout(res, 1000));
  }
  throw new Error(`Timeout waiting for table ${tableName} to become ACTIVE`);
};

export const run = async () => {
  for (const { name, params } of TABLES) {
    try {
      await ddbClient.send(new DescribeTableCommand({ TableName: name }));
      console.log(`Table "${name}" already exists.`);
    } catch (err: any) {
      if (err.name === 'ResourceNotFoundException') {
        try {
          const data = await ddbClient.send(new CreateTableCommand(params));
          console.log(
            `Table "${name}" creation initiated:`,
            data.TableDescription?.TableStatus,
          );

          await waitForTableToBeActive(name);
          console.log(`Table "${name}" is now ACTIVE.`);
        } catch (createErr) {
          console.error(`Error creating table "${name}"`, createErr);
        }
      } else {
        console.error(`Error checking table "${name}"`, err);
      }
    }
  }
};

run();
