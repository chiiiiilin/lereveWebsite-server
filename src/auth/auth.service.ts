import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserRoleEnum } from 'src/users/users.schema';

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
  ): Promise<{ username: string; role: string; access_token: string }> {
    this.logger.log(`auth login: ${username}`);
    const user = await this.usersService.findUserFromLogin(username, password);
    if (!user) throw new UnauthorizedException();

    const payload = { sub: user._id, username: user.username, role: user.role };
    return {
      username: user.username,
      role: user.role,
      access_token: this.jwtService.sign(payload),
    };
  }

  refreshToken(username: string, role: UserRoleEnum) {
    this.logger.log(`refresh token: ${username}`);
    return {
      access_token: this.jwtService.sign({ username, role }),
    };
  }
}
