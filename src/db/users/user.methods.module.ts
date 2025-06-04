import { Module } from '@nestjs/common';
import { CreateUser } from './create-user';
import { ListUsers } from './list-users';
import { UpdateUser } from './update-user';
import { FindUserById } from './findById-user';
import { DeleteUser } from './delete-user';
import { FindUserByEmail } from './findByEmail-user';

@Module({
  providers: [
    CreateUser,
    ListUsers,
    UpdateUser,
    FindUserById,
    DeleteUser,
    FindUserByEmail,
  ],
  exports: [
    CreateUser,
    ListUsers,
    UpdateUser,
    FindUserById,
    DeleteUser,
    FindUserByEmail,
  ],
})
export class UserMethodsModule {}
