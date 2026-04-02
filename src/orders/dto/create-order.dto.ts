import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  ChannelEnum,
  CvsStoreTypeEnum,
  PaymentTypeEnum,
  ShippingTypeEnum,
} from '../orders.schema';

// === 子 DTO ===

class CustomerInfoDto {
  @ApiProperty({ description: '客戶姓名' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '客戶電話' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'LINE 用戶 ID', required: false })
  @IsString()
  @IsOptional()
  lineUserId?: string;
}

class VariantSnapshotDto {
  @ApiProperty({ description: '口味' })
  @IsString()
  @IsNotEmpty()
  flavor: string;

  @ApiProperty({ description: '尺寸', required: false })
  @IsString()
  @IsOptional()
  size?: string;
}

class OrderItemDto {
  @ApiProperty({ description: '商品 ID' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: '下單當下的規格快照', type: VariantSnapshotDto })
  @ValidateNested()
  @Type(() => VariantSnapshotDto)
  variantSnapshot: VariantSnapshotDto;

  @ApiProperty({ description: '數量' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: '下單當下的單價' })
  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;
}

class ShippingInfoDto {
  @ApiProperty({ description: '配送方式', enum: ShippingTypeEnum })
  @IsEnum(ShippingTypeEnum)
  type: ShippingTypeEnum;

  @ApiProperty({ description: '收件人姓名' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '收件人電話' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  // delivery 專用
  @ApiProperty({ description: '配送地址', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  // cvs 專用
  @ApiProperty({
    description: '超商類型',
    enum: CvsStoreTypeEnum,
    required: false,
  })
  @IsEnum(CvsStoreTypeEnum)
  @IsOptional()
  storeType?: CvsStoreTypeEnum;

  // 面交專用
  @ApiProperty({ description: '面交地點 ID', required: false })
  @IsString()
  @IsOptional()
  meetLocationId?: string;

  @ApiProperty({ description: '面交時間', required: false })
  @IsOptional()
  meetTime?: Date;

  @ApiProperty({ description: '備註', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

class PaymentInfoDto {
  @ApiProperty({ description: '付款方式', enum: PaymentTypeEnum })
  @IsEnum(PaymentTypeEnum)
  type: PaymentTypeEnum;

  @ApiProperty({ description: '匯款帳號末五碼', required: false })
  @IsString()
  @IsOptional()
  bankAccountLast5?: string;

  @ApiProperty({ description: '匯款時間', required: false })
  @IsOptional()
  transferredAt?: Date;

  @ApiProperty({ description: '備註', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

// === 主 DTO ===

export class CreateOrderDto {
  @ApiProperty({ description: '使用者 ID（有帳號才填）', required: false })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ description: '訂單總金額' })
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @ApiProperty({ description: '訂單備註', required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ description: '訂單來源', enum: ChannelEnum })
  @IsEnum(ChannelEnum)
  channel: ChannelEnum;

  @ApiProperty({ description: '客戶資訊', type: CustomerInfoDto })
  @ValidateNested()
  @Type(() => CustomerInfoDto)
  customerInfo: CustomerInfoDto;

  @ApiProperty({ description: '配送資訊', type: ShippingInfoDto })
  @ValidateNested()
  @Type(() => ShippingInfoDto)
  shippingInfo: ShippingInfoDto;

  @ApiProperty({ description: '付款資訊', type: PaymentInfoDto })
  @ValidateNested()
  @Type(() => PaymentInfoDto)
  paymentInfo: PaymentInfoDto;

  @ApiProperty({ description: '訂單商品', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
