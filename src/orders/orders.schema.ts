import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum OrderStatusEnum {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  DELIVERED = 'delivered',
  COMPLETE = 'complete',
  CANCELLED = 'cancelled',
}

export enum PaymentStatusEnum {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
}

export enum ChannelEnum {
  WEB = 'web',
  LINE = 'line',
  OTHERS = 'others',
}

export enum ShippingTypeEnum {
  DELIVERY = 'delivery',
  CVS = 'cvs',
  MEET = 'meet',
}

export enum CvsStoreTypeEnum {
  SEVEN = '7-11',
  FAMI = 'famiport',
}

export enum PaymentTypeEnum {
  TRANSFER = 'transfer',
  CASH = 'cash',
}

// === 子類別 ===
@Schema({ _id: false })
export class CustomerInfo {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  lineUserId?: string;
}

@Schema({ _id: false })
export class ShippingInfo {
  @Prop({ required: true, enum: ShippingTypeEnum })
  type: ShippingTypeEnum;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  // delivery 專用
  @Prop()
  address?: string;

  // cvs 專用
  @Prop({ enum: CvsStoreTypeEnum })
  storeType?: CvsStoreTypeEnum;

  // 面交專用
  @Prop({ type: Types.ObjectId, ref: 'MeetLocation' })
  meetLocationId?: Types.ObjectId;

  @Prop()
  meetTime?: Date;

  @Prop()
  note?: string;
}

@Schema({ _id: false })
export class PaymentInfo {
  @Prop({ required: true, enum: PaymentTypeEnum })
  type: PaymentTypeEnum;

  @Prop()
  bankAccountLast5?: string;

  @Prop()
  transferredAt?: Date;

  @Prop()
  note?: string;
}

@Schema({ _id: false })
export class VariantSnapshot {
  @Prop({ required: true })
  flavor: string;

  @Prop()
  size?: string;
}

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, type: VariantSnapshot })
  variantSnapshot: VariantSnapshot;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;
}

// === 主要 schema ===
export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop({
    required: true,
    default: OrderStatusEnum.PENDING,
    enum: OrderStatusEnum,
  })
  status: OrderStatusEnum;

  @Prop({ required: true })
  totalPrice: number;

  @Prop()
  note?: string;

  @Prop({
    required: true,
    default: PaymentStatusEnum.PENDING,
    enum: PaymentStatusEnum,
  })
  paymentStatus: PaymentStatusEnum;

  @Prop({ required: true, enum: ChannelEnum })
  channel: ChannelEnum;

  @Prop({ required: true })
  customerInfo: CustomerInfo;

  @Prop({ required: true })
  shippingInfo: ShippingInfo;

  @Prop({ required: true })
  paymentInfo: PaymentInfo;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
