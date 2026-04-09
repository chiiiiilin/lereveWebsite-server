import {
  Controller,
  Post,
  Logger,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UploadService } from './upload.service';
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

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  private readonly logger = new Logger(UploadController.name);

  /**上傳檔案 */
  @Post()
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

    return this.uploadService.uploadImage({
      buffer,
      originalname: file.filename,
      mimetype: file.mimetype,
    });
  }
}
