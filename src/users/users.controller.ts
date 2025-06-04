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
import { Roles } from 'src/auth/decoretors/roles.decorator';
import { UserRole } from './enums/userRole.enum';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ORGANIZADOR)
  @Get()
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findById(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtPayload },
  ) {
    if (req.user.sub === id || req.user.role === UserRole.ORGANIZADOR) {
      return await this.userService.findById(id);
    }

    throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtPayload },
  ) {
    try {
      if (req.user.sub === id || req.user.role === UserRole.ORGANIZADOR) {
        return await this.userService.delete(id);
      }
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error deleting user',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
