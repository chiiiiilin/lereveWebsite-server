import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findUserFromLogin: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('登入成功回傳token', async () => {
    (usersService.findUserFromLogin as jest.Mock).mockResolvedValue({
      _id: 'user123',
      username: 'test',
      role: 'admin',
    });
    (jwtService.sign as jest.Mock).mockReturnValue('fake-token');

    const result = await service.logIn('test', '1234');

    expect(result).toEqual({
      username: 'test',
      role: 'admin',
      access_token: 'fake-token',
      refresh_token: 'fake-token',
    });
  });

  it('登入失敗拋出錯誤', async () => {
    (usersService.findUserFromLogin as jest.Mock).mockResolvedValue(null);

    await expect(service.logIn('test', '1234')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
