import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import { UserStatus } from '../enums/userStatus.enum';
import { UserRole } from '../enums/userRole.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one letter and one number',
  })
  password: string;

  @IsNotEmpty()
  @Matches(/^\+?[0-9\s\-()]{10,20}$/, {
    message: 'Phone number format is invalid',
  })
  phone: string;

  @IsOptional()
  @IsUrl()
  profileImageUrl?: string;

  @IsEnum(UserStatus)
  isActive?: number;

  @IsEnum(UserRole)
  role: UserRole;
}
