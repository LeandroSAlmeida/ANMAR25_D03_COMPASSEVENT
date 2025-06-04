import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { UserStatus } from '../enums/userStatus.enum';
import { UserRole } from '../enums/userRole.enum';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Leandro Souza' })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'leandro@gmail.com' })
  email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number',
  })
  @ApiProperty({ example: 'SenhaForte133' })
  password: string;

  @IsNotEmpty()
  @Matches(/^\+?[0-9]{10,15}$/, {
    message: 'Phone number format is invalid',
  })
  @ApiProperty({ example: '5511999999999' })
  phone: string;

  @IsOptional()
  profileImageUrl?: string;

  @IsEnum(UserStatus, {
    message: 'isActive must be either 0 (disabled) or 1 (active)',
  })
  @IsOptional()
  @ApiProperty({ enum: UserStatus })
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    return Number(value);
  })
  isActive?: UserStatus;

  @IsEnum(UserRole, {
    message:
      'role must be one of the following values: organizador, participante',
  })
  @IsOptional()
  @ApiProperty({ enum: UserRole })
  role?: UserRole;
}
