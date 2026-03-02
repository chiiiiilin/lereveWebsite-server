import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new Logger(UsersController.name);

  /**新增使用者 */
  @Post('add')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '新增使用者',
    description: '新增使用者',
  })
  create(@Body() body: CreateUserDto) {
    this.logger.log(`POST Create User - ${JSON.stringify(body)}`);
    return this.usersService.addUser(body);
  }

  /**修改使用者 */
  @Put('edit/:userId')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '修改使用者',
    description: '修改使用者',
  })
  editUser(@Param('userId') userId: string, @Body() body: UpdateUserDto) {
    this.logger.log(`PUT user - ${userId}`);
    return this.usersService.putUser(userId, body);
  }

  /**軟刪除使用者 */
  @Put('remove/:userId')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '刪除使用者',
    description: '刪除使用者',
  })
  removeUser(@Param('userId') userId: string) {
    this.logger.log(`PUT remove user - ${userId}`);
    return this.usersService.putUser(userId, {}, true);
  }
}
