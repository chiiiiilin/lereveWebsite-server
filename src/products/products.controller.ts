import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Logger,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from 'src/auth/auth.decorator';
import { UserRoleEnum } from 'src/users/users.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  private readonly logger = new Logger(ProductsController.name);

  /**新增商品 */
  @Post('add')
  @Auth(UserRoleEnum.ADMIN)
  @ApiOperation({
    summary: '新增商品',
    description: '新增商品',
  })
  create(@Body() body: CreateProductDto) {
    this.logger.log(`[POST] Create Product - ${JSON.stringify(body)}`);
    return this.productsService.create(body);
  }

  /**取得商品列表 */
  @Get()
  @ApiOperation({
    summary: '取得商品列表',
    description: '取得商品列表，不包含description',
  })
  findAll() {
    return this.productsService.findAll();
  }

  /**取得商品 */
  @Get(':productId')
  @ApiOperation({
    summary: '取得商品資訊',
    description: '取得詳細商品資訊',
  })
  findOne(@Param('productId') id: string) {
    return this.productsService.findOne(id);
  }

  /**更新商品 */
  @Put('edit/:productId')
  @Auth(UserRoleEnum.ADMIN)
  @ApiOperation({
    summary: '更新商品',
    description: '更新商品',
  })
  update(
    @Param('productId') productId: string,
    @Body() body: UpdateProductDto,
  ) {
    this.logger.log(`[PUT] Update Product - ${productId}`);
    return this.productsService.update(productId, body);
  }

  /**軟刪除商品 */
  @Put('remove/:productId')
  @Auth(UserRoleEnum.ADMIN)
  @ApiOperation({
    summary: '刪除商品',
    description: '刪除商品',
  })
  remove(@Param('productId') productId: string) {
    this.logger.log(`[PUT] Remove Product - ${productId}`);
    return this.productsService.update(productId, {}, true);
  }
}
