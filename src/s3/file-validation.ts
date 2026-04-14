import { BadRequestException } from '@nestjs/common';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSION = ['jpg', 'jpeg', 'png', 'webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function validateImageFile(params: {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}) {
  const { buffer, originalname, mimetype } = params;

  if (buffer.length > MAX_SIZE_BYTES) {
    throw new BadRequestException('檔案過大，不可超過 5MB');
  }
  if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
    throw new BadRequestException(
      `不支援的格式：${mimetype}, 允許jpeg/jpg/png/webp`,
    );
  }
  const ext = originalname.split('.').pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSION.includes(ext)) {
    throw new BadRequestException(
      `副檔名${ext}不被允許，允許jpg/jpeg/png/webp`,
    );
  }

  const { fileTypeFromBuffer } = await import('file-type');
  const detected = await fileTypeFromBuffer(buffer);

  if (!detected) {
    throw new BadRequestException('無法識別檔案格式，請上傳有效的圖片');
  }

  if (!ALLOWED_MIME_TYPES.includes(detected.mime)) {
    throw new BadRequestException(`檔案格式 ${detected.mime} 不被允許`);
  }

  return { detectedMime: detected.mime };
}
