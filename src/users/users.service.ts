import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateUser } from '../db/users/create-user';
import { AwsS3Service } from '../aws/s3.service';
import { ListUsers } from 'src/db/users/list-users';
import { UserStatus } from './enums/userStatus.enum';

@Injectable()
export class UserService {
  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly createUser: CreateUser,
    private readonly listUsers: ListUsers,
  ) {}

  async createUserService(dto: CreateUserDto) {
    const createUserDto = plainToInstance(CreateUserDto, dto);

    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      throw new Error('Validation failed: ' + JSON.stringify(errors));
    }

    if (dto.profileImageUrl) {
      console.log(
        'UserService - profileImageUrl received:',
        dto.profileImageUrl.substring(0, 50) + '...',
      );

      let buffer: Buffer;
      let mimeType: string;
      let fileExtension: string;

      const match = dto.profileImageUrl.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        const base64Data = match[2];
        buffer = Buffer.from(base64Data, 'base64');
        fileExtension = mimeType.split('/')[1];
      } else {
        console.warn(
          'UserService - profileImageUrl whitout data:base64, assuming pure base64.',
        );
        buffer = Buffer.from(dto.profileImageUrl, 'base64');
        mimeType = 'application/octet-stream';
        fileExtension = 'bin';
      }

      const fileName = `user-${Date.now()}.${fileExtension}`;
      console.log('UserService - uploading file to S3:', fileName);

      const uploadedUrl = await this.awsS3Service.uploadFile(
        buffer,
        fileName,
        mimeType,
      );

      console.log('UserService Upload completed, URL:', uploadedUrl);

      createUserDto.profileImageUrl = uploadedUrl;
    }

    const newUser = await this.createUser.execute(createUserDto);
    return newUser;
  }

  async listUsersService(
    filters: {
      name?: string;
      email?: string;
      role?: string;
      status?: UserStatus;
    },
    pagination: { limit?: number; page?: number },
  ) {
    return await this.listUsers.execute(filters, pagination);
  }
}
