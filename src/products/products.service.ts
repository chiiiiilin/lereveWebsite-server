import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './products.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}
  private readonly logger = new Logger(ProductsService.name);

  /**新增商品 */
  async create(data: CreateProductDto) {
    const newProduct = new this.productModel(data);
    const saved = await newProduct.save();
    const { trashed: _trashed, ...result } = saved.toObject();
    return result;
  }

  /**查詢所有商品列表 */
  async findAll() {
    return await this.productModel
      .find({ trashed: false })
      .select('-description -trashed -variants.trashed -__v')
      .exec();
  }

  /**查詢單一品項 */
  async findOne(productId: string) {
    const product = await this.productModel
      .findById(productId)
      .select('-trashed -__v')
      .exec();
    if (!product) {
      throw new NotFoundException('商品不存在');
    }
    return product;
  }

  /**更新商品 */
  async update(productId: string, data: UpdateProductDto, trashed?: boolean) {
    const exists = await this.productModel.exists({
      _id: productId,
      trashed: false,
    });
    if (!exists)
      throw new BadRequestException(`Product not found: ${productId}`);
    const update = {
      ...data,
      ...(trashed !== undefined && { trashed }),
    };
    const updated = await this.productModel
      .findByIdAndUpdate(productId, update, { new: true })
      .select('-trashed -__v')
      .exec();
    return updated;
  }
}
