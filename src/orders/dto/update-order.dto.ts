import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatusEnum, PaymentStatusEnum } from '../orders.schema';

export class UpdateOrderDto {
  @ApiProperty({
    description: '訂單狀態',
    enum: OrderStatusEnum,
    required: false,
  })
  @IsEnum(OrderStatusEnum)
  @IsOptional()
  status?: OrderStatusEnum;

  @ApiProperty({
    description: '付款狀態',
    enum: PaymentStatusEnum,
    required: false,
  })
  @IsEnum(PaymentStatusEnum)
  @IsOptional()
  paymentStatus?: PaymentStatusEnum;
}
