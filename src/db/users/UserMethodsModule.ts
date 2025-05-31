import { Module } from '@nestjs/common';
import { CreateUser } from './create-user';
import { ListUsers } from './list-users';
import { UpdateUser } from './update-user';

@Module({
  providers: [CreateUser, ListUsers, UpdateUser],
  exports: [CreateUser, ListUsers, UpdateUser],
})
export class UserMethodsModule {}
