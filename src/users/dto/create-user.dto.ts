// import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: '使用者名稱',
    required: true,
    default: 'username',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: '電子郵件',
    required: true,
    default: 'email',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '密碼',
    required: true,
    default: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  // constructor(data: Record<string, unknown>) {
  //   if (!data.username || typeof data.username !== 'string') {
  //     throw new BadRequestException('username 必填且須為字串');
  //   }
  //   if (!data.email || typeof data.email !== 'string') {
  //     throw new BadRequestException('email 必填且須為字串');
  //   }
  //   if (!data.password || typeof data.password !== 'string') {
  //     throw new BadRequestException('password is required and be a string');
  //   }
  //   if (!Object.values(UserRoleEnum).includes(data.role as UserRoleEnum)) {
  //     throw new BadRequestException('role must be admin or user');
  //   }
  //   this.username = data.username;
  //   this.email = data.email;
  //   this.password = data.password;
  //   this.role = data.role as UserRoleEnum;
  // }
}
