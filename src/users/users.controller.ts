import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Logger,
  Req,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/auth.decorator';
import { JWTObject } from 'src/auth/auth.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new Logger(UsersController.name);

  /**新增使用者 */
  @Post('add')
  @ApiOperation({
    summary: '新增使用者',
    description: '新增使用者',
  })
  // createUser(@Body() body: Record<string, unknown>) {
  createUser(@Body() body: CreateUserDto) {
    this.logger.log(`[POST] Create User - ${JSON.stringify(body)}`);
    // const dto = new CreateUserDto(body);
    // return this.usersService.addUser(dto);
    return this.usersService.addUser(body);
  }

  /**修改使用者 */
  @Put('edit/:userId')
  @Auth()
  @ApiOperation({
    summary: '修改使用者',
    description: '修改使用者',
  })
  editUser(
    @Param('userId') userId: string,
    @Body() body: UpdateUserDto,
    @Req() req: { user: JWTObject },
  ) {
    this.logger.log(`[PUT] user - ${userId}`);
    return this.usersService.putUser(userId, body, undefined, req.user.userId);
  }

  /**軟刪除使用者 */
  @Put('remove/:userId')
  @Auth()
  @ApiOperation({
    summary: '刪除使用者',
    description: '刪除使用者',
  })
  removeUser(@Param('userId') userId: string) {
    this.logger.log(`[PUT] remove user - ${userId}`);
    return this.usersService.putUser(userId, {}, true);
  }
}
