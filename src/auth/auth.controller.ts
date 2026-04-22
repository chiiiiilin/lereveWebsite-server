import {
  Body,
  Controller,
  Post,
  Request,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { LoginRequest } from 'src/auth/auth.dto';
import { AuthService } from './auth.service';
import { Throttle } from '@nestjs/throttler';
import * as fastify from 'fastify';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

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
  async login(
    @Body() body: LoginRequest,
    @Response({ passthrough: true }) res: fastify.FastifyReply,
  ) {
    const { username, role, access_token, refresh_token } =
      await this.authService.logIn(body.username, body.password);

    res.setCookie('refresh_token', refresh_token, COOKIE_OPTIONS);

    return { username, role, access_token };
  }

  // 刷新token
  @Post('refreshToken')
  @ApiOperation({
    summary: '刷新Token',
    description: '帶有效的 refresh token cookie 刷新 access token',
  })
  refreshToken(
    @Request() req: fastify.FastifyRequest,
    @Response({ passthrough: true }) res: fastify.FastifyReply,
  ) {
    const token = req.cookies['refresh_token'];
    if (!token) throw new UnauthorizedException();

    const { access_token, refresh_token } =
      this.authService.refreshToken(token);

    res.setCookie('refresh_token', refresh_token, COOKIE_OPTIONS);

    return { access_token };
  }

  // 登出
  @Post('logout')
  @ApiOperation({ summary: '登出' })
  logout(@Response({ passthrough: true }) res: fastify.FastifyReply) {
    res.clearCookie('refresh_token', { path: '/api/auth' });
    return { message: 'logged out' };
  }
}
