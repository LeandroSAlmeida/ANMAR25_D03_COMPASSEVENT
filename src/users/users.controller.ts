/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Query,
  Get,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserService } from '../users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

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
}
