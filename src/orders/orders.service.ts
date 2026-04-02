import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './orders.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}
  private readonly logger = new Logger(OrdersService.name);

  /**新增訂單 */
  async create(data: CreateOrderDto) {
    const newOrder = new this.orderModel(data);
    const saved = await newOrder.save();
    this.logger.log(`Add order: total price = ${saved.totalPrice}`);

    return saved;
  }

  /**查詢所有訂單 */
  async findAll(page = 1, limit = 20, userId?: string) {
    const filter = userId ? { userId } : {};
    return await this.orderModel
      .find(filter)
      .sort({ createdAt: -1 })
      .select('userId status totalPrice paymentStatus paymentInfo items')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  /**查詢本人所有訂單 */
  async findAllByUser(userId: string) {
    return await this.orderModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .select('status totalPrice paymentStatus items')
      .exec();
  }

  /**查詢某筆訂單 */
  async findOne(orderId: string, userId?: string) {
    const filter = userId ? { _id: orderId, userId } : { _id: orderId };
    const result = await this.orderModel.findOne(filter).exec();
    if (!result) throw new NotFoundException(`Order not found: ${orderId}`);

    return result;
  }

  /**更新訂單 */
  async update(orderId: string, data: UpdateOrderDto) {
    const updated = await this.orderModel
      .findByIdAndUpdate(orderId, data, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Order not found: ${orderId}`);
    this.logger.log(`Update order ${orderId}: ${JSON.stringify(data)}`);

    return updated;
  }
}
