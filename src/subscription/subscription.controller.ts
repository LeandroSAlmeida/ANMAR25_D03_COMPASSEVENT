import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  Delete,
  Req,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { ListSubscriptionsByUser } from 'src/db/subscription/listUser-subscription';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/decoretors/roles.decorator';
import { UserRole } from 'src/users/enums/userRole.enum';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('subscription')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly listByUserId: ListSubscriptionsByUser,
  ) {}

  @Roles(UserRole.ORGANIZADOR, UserRole.PARTICIPANTE)
  @Post()
  async create(@Body() dto: CreateSubscriptionDto): Promise<Subscription> {
    return this.subscriptionService.create(dto);
  }

  @Get('subscriptions/:id')
  async listByUser(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtPayload },
    @Query('limit') limit = 10,
    @Query('lastKey') lastKey?: string,
  ) {
    try {
      if (req.user.sub !== id) {
        throw new UnauthorizedException('Access denied');
      }

      const result = await this.subscriptionService.listByUserId(
        id,
        Number(limit),
        lastKey,
      );

      return {
        data: result.data,
        pagination: {
          limit: Number(limit),
          total: result.data.length,
          totalPages: 1,
          page: 1,
        },
        nextPageToken: result.nextPageToken ?? null,
        hasMore: !!result.nextPageToken,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error listing subscriptions',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':userId/:eventId')
  delete(@Param('userId') userId: string, @Param('eventId') eventId: string) {
    return this.subscriptionService.softDeleteSubscription(userId, eventId);
  }
}
