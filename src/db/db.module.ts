import { Module } from '@nestjs/common';
import { DynamoDBProvider } from './dynamodb.provider';

@Module({
  providers: [DynamoDBProvider],
  exports: [DynamoDBProvider],
})
export class DbModule {}
