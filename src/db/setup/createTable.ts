import {
  CreateTableCommand,
  CreateTableInput,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
import { ddbClient } from '../libs/ddbClients';

const USERS_TABLE_NAME = 'Users';

const params: CreateTableInput = {
  TableName: USERS_TABLE_NAME,
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: 'HASH',
    },
  ],
  AttributeDefinitions: [
    {
      AttributeName: 'id',
      AttributeType: 'S',
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  StreamSpecification: {
    StreamEnabled: false,
  },
};

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
  try {
    await ddbClient.send(
      new DescribeTableCommand({ TableName: USERS_TABLE_NAME }),
    );
    console.log(`Table "${USERS_TABLE_NAME}" already exists.`);
  } catch (err: any) {
    if (err.name === 'ResourceNotFoundException') {
      try {
        const data = await ddbClient.send(new CreateTableCommand(params));
        console.log(
          'Table creation initiated:',
          data.TableDescription?.TableStatus,
        );

        await waitForTableToBeActive(USERS_TABLE_NAME);
        console.log(`Table "${USERS_TABLE_NAME}" is now ACTIVE.`);
      } catch (createErr) {
        console.error('Error creating table', createErr);
      }
    } else {
      console.error('Error checking existence of table', err);
    }
  }
};

run();
