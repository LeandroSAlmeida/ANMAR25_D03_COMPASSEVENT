import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AwsS3Service } from './s3.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('upload')
export class UploadController {
  constructor(private readonly awsS3Service: AwsS3Service) {}
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async uploadImage(
    @Body() body: { imageBase64: string; fileName: string; mimeType: string },
  ) {
    const base64Data = body.imageBase64.replace(
      /^data:image\/[a-z]+;base64,/,
      '',
    );
    const buffer = Buffer.from(base64Data, 'base64');
    const url = await this.awsS3Service.uploadFile(
      buffer,
      body.fileName,
      body.mimeType,
    );
    return { url };
  }
}
