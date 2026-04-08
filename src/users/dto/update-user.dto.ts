import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRoleEnum } from '../users.schema';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserRoleDto {
  @ApiProperty({
    description: '使用者權限',
    required: true,
    default: UserRoleEnum.ADMIN,
  })
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;
}
