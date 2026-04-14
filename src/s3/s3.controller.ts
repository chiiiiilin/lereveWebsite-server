import {
  Controller,
  Post,
  Logger,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { S3Service } from './s3.service';
import '@fastify/multipart';
import { ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
import { UserRoleEnum } from 'src/users/users.schema';

interface MultipartRequest {
  file: () => Promise<
    | {
        toBuffer: () => Promise<Buffer>;
        filename: string;
        mimetype: string;
      }
    | undefined
  >;
}

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}
  private readonly logger = new Logger(S3Controller.name);

  /**上傳圖片 */
  @Post('upload')
  @Auth(UserRoleEnum.ADMIN)
  @ApiOperation({
    summary: '上傳檔案',
    description: '上傳檔案',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(@Req() req: unknown) {
    const file = await (req as MultipartRequest).file();
    if (!file) throw new BadRequestException('no file uploaded');

    const buffer = await file.toBuffer();

    return this.s3Service.uploadImage({
      buffer,
      originalname: file.filename,
      mimetype: file.mimetype,
    });
  }
}
