import { Module } from '@nestjs/common';
import { CreateUser } from './create-user';

@Module({
  providers: [CreateUser],
  exports: [CreateUser],
})
export class UserMethodsModule {}
