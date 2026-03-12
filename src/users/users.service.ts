import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  private readonly logger = new Logger(UsersService.name);

  /**新增使用者 */
  async addUser(data: CreateUserDto) {
    const { password, ...rest } = data;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ ...rest, passwordHash });
    const saved = await newUser.save();
    return {
      username: saved.username,
      email: saved.email,
      role: saved.role,
    };
  }

  /**登入找到使用者 */
  async findUserFromLogin(username: string, password: string) {
    const user = await this.userModel
      .findOne({ username, trashed: false })
      .exec();
    if (!user) return undefined;

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    return isMatch ? user : undefined;
  }

  /**更新使用者 */
  async putUser(userId: string, data: UpdateUserDto, trashed?: boolean) {
    const exists = await this.userModel.exists({ _id: userId, trashed: false });
    if (!exists) throw new BadRequestException(`User not found: ${userId}`);
    const { password, ...rest } = data;
    const update = {
      ...rest,
      ...(password && { passwordHash: await bcrypt.hash(password, 10) }),
      ...(trashed !== undefined && { trashed }),
    };
    const updated = await this.userModel
      .findByIdAndUpdate(userId, update, {
        new: true,
      })
      .select('-passwordHash -trashed -__v')
      .exec();
    return updated;
  }
}
