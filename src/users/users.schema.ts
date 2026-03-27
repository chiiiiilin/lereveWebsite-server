import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum UserRoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
export class SavedAddress {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  address: string;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ default: UserRoleEnum.USER, required: true })
  username: string;

  @Prop({ default: '', required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: [SavedAddress], default: [] })
  savedAddresses: SavedAddress[];

  @Prop({ required: true, default: UserRoleEnum.USER, enum: UserRoleEnum })
  role: UserRoleEnum;

  @Prop({ default: false })
  trashed: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
