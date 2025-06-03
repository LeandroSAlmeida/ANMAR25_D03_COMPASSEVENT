import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { ListSubscriptionsByUser } from 'src/db/subscription/listUser-subscription';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly listByUserId: ListSubscriptionsByUser,
  ) {}

  @Post()
  async create(@Body() dto: CreateSubscriptionDto): Promise<Subscription> {
    return this.subscriptionService.create(dto);
  }

  @Get('subscriptions/:id')
  async listByUser(
    @Param('id') id: string,
    @Query('limit') limit = 10,
    @Query('lastKey') lastKey?: string,
  ) {
    const result = await this.listByUserId.execute(id, Number(limit), lastKey);

    return {
      data: result.data,
      pagination: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      },
      nextPageToken: result.nextPageToken,
      hasMore: result.hasMore,
    };
  }

  @Delete(':userId/:eventId')
  delete(@Param('userId') userId: string, @Param('eventId') eventId: string) {
    return this.subscriptionService.softDeleteSubscription(userId, eventId);
  }
}
