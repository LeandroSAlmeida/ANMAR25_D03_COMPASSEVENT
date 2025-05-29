import { Module } from '@nestjs/common';
import { AwsS3Service } from './s3.service';
import { UploadController } from './s3.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AwsS3Service],
  controllers: [UploadController],
  exports: [AwsS3Service],
})
export class S3Module {}
