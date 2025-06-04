import { Module } from '@nestjs/common';
import { CreateUser } from './create-user';
import { ListUsers } from './list-users';
import { UpdateUser } from './update-user';
import { FindUserById } from './findById-user';
import { DeleteUser } from './delete-user';
import { FindUserByEmail } from './findByEmail-user';
import { MailModule } from '../../mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [
    CreateUser,
    ListUsers,
    UpdateUser,
    FindUserById,
    DeleteUser,
    FindUserByEmail,
    MailModule,
  ],
  exports: [
    CreateUser,
    ListUsers,
    UpdateUser,
    FindUserById,
    DeleteUser,
    FindUserByEmail,
    MailModule,
  ],
})
export class UserMethodsModule {}
