import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );
    const sessionToken = this.configService.get<string>('AWS_SESSION_TOKEN');
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
      throw new Error('Missing AWS configuration in environment variables');
    }

    this.bucketName = bucketName;

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
        sessionToken,
      },
    });
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<string> {
    const key = `images/${fileName}`;

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(params));
      const region = this.configService.get<string>('AWS_REGION');
      return `https://${this.bucketName}.s3.${region}.amazonaws.com/${key}`;
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }
}
