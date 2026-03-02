import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRoleEnum } from './dto/create-user.dto';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
export class SavedAddress {
  @Prop({ type: String, required: true })
  label: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: Boolean, default: false })
  isDefault: boolean;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  phone: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, default: 'user', required: true })
  username: string;

  @Prop({ type: String, default: ' ', required: true })
  email: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: [SavedAddress], default: [] })
  savedAddresses: SavedAddress[];

  @Prop({
    type: String,
    required: true,
    default: UserRoleEnum.USER,
    enum: UserRoleEnum,
  })
  role: UserRoleEnum;

  @Prop({ type: Boolean, required: true, default: false })
  trashed: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
