import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './users.schema';
import { NotFoundException } from '@nestjs/common';

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

  it('更新沒傳密碼就不動passwordHash', async () => {
    mockUserModel.exists.mockResolvedValue({ _id: 'userA' });
    mockUserModel.findByIdAndUpdate.mockReturnValue(
      mockChain({ _id: 'userA' }),
    );

    await service.putUser('userA', { email: 'test@test.com' }, undefined);

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

    await service.putUser('userA', { password: 'test' }, undefined);

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

    await service.putUser('userA', {}, true);

    expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'userA',
      { trashed: true },
      { new: true },
    );
  });
});
