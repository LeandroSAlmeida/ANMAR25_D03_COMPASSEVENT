/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Query,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserService } from '../users/users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from 'src/auth/decoretors/public.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(@Body() dto: CreateUserDto) {
    try {
      const user = await this.userService.createUserService(dto);
      return user;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error creating user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async list(
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('role') role?: string,
    @Query('isActive') isActive?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    try {
      const filters = {
        name,
        email,
        role,
        isActive: isActive !== undefined ? Number(isActive) : undefined,
      };

      const pagination = {
        limit: limit ? parseInt(limit, 10) : undefined,
        page: page ? parseInt(page, 10) : undefined,
      };

      const result = await this.userService.listUsersService(
        filters,
        pagination,
      );
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error listing users',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    try {
      if (req.user?.sub !== id) {
        console.log('ID do token:', req.user?.sub);
        console.log('ID da rota:', id);
        throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
      }

      const user = await this.userService.updateUserService(id, dto);
      return user;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error updating user',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
