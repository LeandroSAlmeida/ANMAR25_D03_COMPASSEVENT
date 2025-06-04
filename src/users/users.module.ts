import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { DbModule } from 'src/db/db.module';
import { S3Module } from 'src/aws/s3.module';
import { UserMethodsModule } from 'src/db/users/user.methods.module';
import { CreateUser } from 'src/db/users/create-user';
import { AwsS3Service } from 'src/aws/s3.service';

@Module({
  imports: [DbModule, S3Module, UserMethodsModule],
  controllers: [UsersController],
  providers: [UserService, CreateUser, AwsS3Service],
  exports: [UserService],
})
export class UsersModule {}
