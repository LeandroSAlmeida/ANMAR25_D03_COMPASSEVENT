import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UploadController } from './aws/s3.controller';
import { AwsS3Service } from './aws/s3.service';
import { EventsModule } from './events/events.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    EventsModule,
    SubscriptionModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService, AwsS3Service],
})
export class AppModule {}
