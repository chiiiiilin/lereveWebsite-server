import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { validateImageFile } from './file-validation';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private readonly logger = new Logger(S3Service.name);

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get('AWS_S3_REGION')!,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')!,
      },
    });
  }

  async uploadImage(file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  }) {
    const { detectedMime } = await validateImageFile(file);

    const bucket = this.configService.get('AWS_S3_BUCKET') as string;
    const ext = file.originalname.split('.').pop();
    const key = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: detectedMime,
    });

    await this.s3.send(command);
    this.logger.log(`uploaded: ${key}`);

    return { key: key };
  }

  async getPresignedUrl(key: string) {
    const bucket = this.configService.get('AWS_S3_BUCKET') as string;

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const result = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    this.logger.log(`get presigned url: ${key}`);

    return result;
  }
}
