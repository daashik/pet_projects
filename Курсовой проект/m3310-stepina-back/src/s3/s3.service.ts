import 'multer';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get('YANDEX_S3_BUCKET_NAME') as string;

    this.s3Client = new S3Client({
      region: 'ru-central1',
      endpoint: 'https://storage.yandexcloud.net',
      credentials: {
        accessKeyId: this.configService.get('YANDEX_S3_KEY_ID') as string,
        secretAccessKey: this.configService.get('YANDEX_S3_SECRET_KEY') as string,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3Client.send(command);
      const fileUrl = `https://storage.yandexcloud.net/${this.bucketName}/${key}`;
      this.logger.log(`File ${key} uploaded successfully. URL: ${fileUrl}`);
      return fileUrl;
    } catch (error) {
      this.logger.error(`Failed to upload file ${key}`, error);
      throw new Error('File upload failed');
    }
  }
}