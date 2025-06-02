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
} from '@nestjs/common';
import { EventService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

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

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEventDto) {
    return this.eventService.update(id, dto);
  }

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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEvent(@Param('id') id: string) {
    await this.eventService.softDeleteEvent(id);
  }
}
