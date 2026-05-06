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
import { UpdateUserDto, UpdateUserRoleDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/auth.decorator';
import { JWTObject } from 'src/auth/auth.dto';
import { UserRoleEnum } from './users.schema';

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

  /**修改自己的帳號資訊 */
  @Put('mine')
  @Auth()
  @ApiOperation({
    summary: '修改自己的帳號資訊',
    description: '修改自己的帳號資訊',
  })
  editUser(@Body() body: UpdateUserDto, @Req() req: { user: JWTObject }) {
    const userId = req.user.userId;
    this.logger.log(`[PUT] user - ${userId}`);
    return this.usersService.putUser(userId, body);
  }

  /**變更使用者權限 */
  @Put('updateRole/:userId')
  @Auth(UserRoleEnum.ADMIN)
  @ApiOperation({
    summary: '變更使用者的權限',
    description: '只有admin可以變更別人的帳號權限',
  })
  updateUserRole(
    @Param('userId') userId: string,
    @Body() body: UpdateUserRoleDto,
  ) {
    this.logger.log(`[PUT] update user role - ${userId}`);
    return this.usersService.updateRole(userId, body);
  }

  /**軟刪除自己的帳號 */
  @Put('mine/remove')
  @Auth()
  @ApiOperation({
    summary: '刪除使用者',
    description: '刪除使用者',
  })
  removeUser(@Req() req: { user: JWTObject }) {
    const userId = req.user.userId;
    this.logger.log(`[PUT] remove user - ${userId}`);
    return this.usersService.putUser(userId, {}, true);
  }
}
