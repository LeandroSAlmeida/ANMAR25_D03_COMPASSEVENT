import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Patch,
  Param,
  ParseUUIDPipe,
  Get,
  Query,
  Delete,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EventService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RolesGuard } from 'src/auth/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from 'src/users/enums/userRole.enum';
import { Roles } from '../auth/decoretors/roles.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('events')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ORGANIZADOR)
  @Post()
  async create(@Body() dto: CreateEventDto) {
    try {
      return await this.eventService.createEventService(dto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error creating event',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEventDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    const loggedOrganizerId = req.user.sub;

    const event = await this.eventService.findById(id);
    if (!event) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }

    if (event.organizerId !== loggedOrganizerId) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    return this.eventService.update(id, dto);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.eventService.findById(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error to search event',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ORGANIZADOR, UserRole.PARTICIPANTE)
  @Get()
  async getAll(@Query() query: any) {
    try {
      return await this.eventService.getAll(query);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro ao listar eventos',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEvent(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtPayload },
  ) {
    try {
      const loggedUserId = req.user.sub;
      const loggedUserRole = req.user.role;

      const event = await this.eventService.findById(id);
      if (!event) {
        throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
      }

      if (
        event.organizerId !== loggedUserId &&
        loggedUserRole !== 'organizador'
      ) {
        throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
      }

      await this.eventService.softDeleteEvent(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error deleting event',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
