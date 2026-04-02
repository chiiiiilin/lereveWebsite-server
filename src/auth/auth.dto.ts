import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { UserRoleEnum } from 'src/users/users.schema';

export class LoginRequest {
  @ApiProperty({
    default: 'Admin',
    description: '使用者名稱',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    default: '123456',
    description: '密碼',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class JWTObject {
  userId: string;
  username: string;
  role: UserRoleEnum;
}
