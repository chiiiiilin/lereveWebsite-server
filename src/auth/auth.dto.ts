import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from 'src/users/dto/create-user.dto';

export class LoginRequest {
  @ApiProperty({
    default: 'Admin',
    description: '使用者名稱',
  })
  username: string;

  @ApiProperty({
    default: '123456',
    description: '密碼',
  })
  password: string;
}

export class JWTObject {
  username: string;
  role: UserRoleEnum;
}
