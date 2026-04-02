import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Req,
  Logger,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { JWTObject } from 'src/auth/auth.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  private readonly logger = new Logger(OrdersController.name);

  /**新增訂單 */
  @Post('add')
  @ApiOperation({
    summary: '建立訂單',
    description: '建立訂單',
  })
  create(@Body() body: CreateOrderDto) {
    this.logger.log(`[POST] Create Oder: ${JSON.stringify(body)}`);
    return this.ordersService.create(body);
  }

  /**賣家查詢所有訂單 */
  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '查詢所有訂單',
    description: '用於賣家查詢所有訂單，查詢單一買家的所有訂單時加上userId參數',
  })
  @ApiQuery({ name: 'userId', required: false })
  findAll(@Query('userId') userId?: string) {
    return this.ordersService.findAll(1, 20, userId);
  }

  /**賣家查詢單筆訂單詳情 */
  @Get(':orderId')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '查詢單筆訂單',
    description: '賣家查詢單筆訂單詳情',
  })
  findOne(@Param('orderId') orderId: string) {
    return this.ordersService.findOne(orderId);
  }

  /**買家查詢所有訂單 */
  @Get('mine')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '買家查詢所有訂單',
    description: '用於買家查詢自己的所有訂單',
  })
  findAllByUser(@Req() req: { user: JWTObject }) {
    return this.ordersService.findAllByUser(req.user.userId);
  }

  /**買家查詢單筆訂單 */
  @Get('mine/:orderId')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '買家查詢單筆訂單詳情',
    description: '買家查詢單筆訂單詳情',
  })
  findOneByUser(
    @Param('orderId') orderId: string,
    @Req() req: { user: JWTObject },
  ) {
    return this.ordersService.findOne(orderId, req.user.userId);
  }

  /**修改單筆訂單 */
  @Put('edit/:orderId')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '更新單筆訂單',
    description: '更新單筆訂單，只允許admin更新訂單狀態及付款確認狀態',
  })
  update(
    @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(orderId, updateOrderDto);
  }
}
