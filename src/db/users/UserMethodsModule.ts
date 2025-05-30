import { Module } from '@nestjs/common';
import { CreateUser } from './create-user';
import { ListUsers } from './list-users';

@Module({
  providers: [CreateUser, ListUsers],
  exports: [CreateUser, ListUsers],
})
export class UserMethodsModule {}
