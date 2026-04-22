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
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  refreshToken(token: string) {
    const { userId, username, role } = this.jwtService.verify(token);
    return {
      access_token: this.jwtService.sign(
        { userId, username, role },
        { expiresIn: '15m' },
      ),
      refresh_token: this.jwtService.sign(
        { userId, username, role },
        { expiresIn: '7d' },
      ),
    };
  }
}
