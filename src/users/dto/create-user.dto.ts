import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum UserRoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}

export class CreateUserDto {
  @ApiProperty({
    description: '使用者名稱',
    required: true,
    default: 'username',
  })
  username: string;

  @ApiProperty({
    description: '電子郵件',
    required: true,
    default: 'email',
  })
  email: string;

  @ApiProperty({
    description: '密碼',
    required: true,
    default: 'password',
  })
  password: string;

  @ApiProperty({
    description: '使用者角色',
    required: true,
    default: UserRoleEnum.USER,
  })
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;
}
