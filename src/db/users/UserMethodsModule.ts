import { Module } from '@nestjs/common';
import { CreateUser } from './create-user';
import { ListUsers } from './list-users';
import { UpdateUser } from './update-user';
import { FindUserById } from './findById-user';

@Module({
  providers: [CreateUser, ListUsers, UpdateUser, FindUserById],
  exports: [CreateUser, ListUsers, UpdateUser, FindUserById],
})
export class UserMethodsModule {}
