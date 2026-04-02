import { AuthGuard } from 'src/auth/auth.guard';
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { UserRoleEnum } from '../users/users.schema';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export const ROLES_KEY = 'roles';
export function Auth(...roles: UserRoleEnum[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(AuthGuard),
    ApiBearerAuth('access-token'),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
