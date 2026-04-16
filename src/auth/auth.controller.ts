import { Request, Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { LoginRequest, JWTObject } from 'src/auth/auth.dto';
import { AuthService } from './auth.service';
import { Auth } from '../auth/auth.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 登入
  @Throttle({ default: { ttl: 60000, limit: 3 } })
  @Post('login')
  @ApiOperation({
    summary: '登入',
    description: '登入',
  })
  async login(@Body() body: LoginRequest): Promise<object> {
    const doc = await this.authService.logIn(body.username, body.password);
    return doc;
  }

  // 刷新token
  @Post('refreshToken')
  @Auth()
  @ApiOperation({
    summary: '刷新Token',
    description: '不需參數，帶有效的Token刷新Token效期，過期則需重新登入',
  })
  refreshToken(@Request() req: { user: JWTObject }) {
    const { username, role } = req.user;
    const doc = this.authService.refreshToken(username, role);
    return doc;
  }
}
