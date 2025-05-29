import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateUser } from '../db/users/create-user';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UsersController {
  private readonly createUserService = new CreateUser();

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const dtoInstance = plainToInstance(CreateUserDto, dto);
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      throw new HttpException(
        { message: 'Validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const user = await this.createUserService.execute(dtoInstance);
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
