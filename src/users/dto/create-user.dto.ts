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

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @IsNotEmpty()
  @Matches(/^\+?[0-9\s\-()]{10,20}$/, {
    message: 'Phone number format is invalid',
  })
  phone: string;

  @IsOptional()
  profileImageUrl?: string;

  @IsEnum(UserStatus, {
    message: 'isActive must be either 0 (disabled) or 1 (active)',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  isActive?: UserStatus;

  @IsEnum(UserRole, {
    message:
      'role must be one of the following values: organizador, participante',
  })
  @IsOptional()
  role?: UserRole;
}
