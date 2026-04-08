import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './users.schema';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const mockUserModel = {
  exists: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

const mockChain = (result) => ({
  select: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(result),
  }),
});

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('使用者不存在拋出錯誤', async () => {
    mockUserModel.exists.mockResolvedValue(null);

    await expect(
      service.putUser('不存在的id', { email: 'test@test.com' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('不能改非自己的帳號', async () => {
    mockUserModel.exists.mockResolvedValue({ _id: 'userA' });

    await expect(
      service.putUser('userA', { email: 'test@test.com' }, undefined, 'userB'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('更新沒傳密碼就不動passwordHash', async () => {
    mockUserModel.exists.mockResolvedValue({ _id: 'userA' });
    mockUserModel.findByIdAndUpdate.mockReturnValue(
      mockChain({ _id: 'userA' }),
    );

    await service.putUser(
      'userA',
      { email: 'test@test.com' },
      undefined,
      'userA',
    );

    expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'userA',
      { email: 'test@test.com' },
      { new: true },
    );
  });

  it('更新密碼要hash', async () => {
    mockUserModel.exists.mockResolvedValue({ _id: 'userA' });
    mockUserModel.findByIdAndUpdate.mockReturnValue(
      mockChain({ _id: 'userA' }),
    );

    await service.putUser('userA', { password: 'test' }, undefined, 'userA');

    expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'userA',
      { passwordHash: expect.any(String) },
      { new: true },
    );
  });

  it('軟刪除使用者', async () => {
    mockUserModel.exists.mockResolvedValue({ _id: 'userA' });
    mockUserModel.findByIdAndUpdate.mockReturnValue(
      mockChain({ _id: 'userA' }),
    );

    await service.putUser('userA', {}, true, 'userA');

    expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'userA',
      { trashed: true },
      { new: true },
    );
  });
});
