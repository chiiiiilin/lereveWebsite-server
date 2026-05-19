import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async logIn(
    username: string,
    password: string,
  ): Promise<{
    username: string;
    role: string;
    email: string;
    access_token: string;
    refresh_token: string;
  }> {
    this.logger.log(`auth login: ${username}`);
    const user = await this.usersService.findUserFromLogin(username, password);
    if (!user) throw new UnauthorizedException();

    const payload = {
      userId: user._id,
      username: user.username,
      role: user.role,
    };
    return {
      username: user.username,
      role: user.role,
      email: user.email,
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token);

      const user = await this.usersService.findUserById(userId);
      return {
        access_token: this.jwtService.sign(
          { userId, username: user.username, role: user.role },
          { expiresIn: '15m' },
        ),
      };
    } catch (error) {
      this.logger.warn('refreshToken failed', error);
      throw new UnauthorizedException();
    }
  }
}
