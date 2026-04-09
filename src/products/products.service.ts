import { UploadService } from './../upload/upload.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './products.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

interface ProductDocument {
  imageKeys?: string[];
  variants?: {
    imageKeys?: string[];
    [key: string]: unknown;
  }[];
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly uploadService: UploadService,
  ) {}
  private readonly logger = new Logger(ProductsService.name);

  private async attachImageUrls(product: ProductDocument) {
    const imageUrls = product.imageKeys?.length
      ? await Promise.all(
          product.imageKeys.map((key) =>
            this.uploadService.getPresignedUrl(key),
          ),
        )
      : undefined;

    const variants = await Promise.all(
      product.variants?.map(async (variant) => ({
        ...variant,
        imageUrls: variant.imageKeys?.length
          ? await Promise.all(
              variant.imageKeys.map((key) =>
                this.uploadService.getPresignedUrl(key),
              ),
            )
          : undefined,
      })) ?? [],
    );

    return { ...product, imageUrls, variants };
  }

  /**新增商品 */
  async create(data: CreateProductDto) {
    const newProduct = new this.productModel(data);
    const saved = await newProduct.save();
    const { trashed: _trashed, ...result } = saved.toObject();
    this.logger.log(`Add product: ${JSON.stringify(result)}`);

    return result;
  }

  /**查詢所有商品列表 */
  async findAll() {
    const products = await this.productModel
      .find({ trashed: false })
      .select('-description -trashed -variants.trashed')
      .exec();

    return Promise.all(
      products.map((product) =>
        this.attachImageUrls(product.toObject() as any),
      ),
    );
  }

  /**查詢單一品項 */
  async findOne(productId: string) {
    const product = await this.productModel
      .findById(productId)
      .select('-trashed')
      .exec();
    if (!product) {
      throw new NotFoundException(`Product not found: ${productId}`);
    }

    return this.attachImageUrls(product.toObject() as any);
  }

  /**更新商品 */
  async update(productId: string, data: UpdateProductDto, trashed?: boolean) {
    const exists = await this.productModel.exists({
      _id: productId,
      trashed: false,
    });
    if (!exists) throw new NotFoundException(`Product not found: ${productId}`);
    const update = {
      ...data,
      ...(trashed !== undefined && { trashed }),
    };
    const updated = await this.productModel
      .findByIdAndUpdate(productId, update, { new: true })
      .select('-trashed')
      .exec();
    this.logger.log(`Update product: ${JSON.stringify(update)}`);

    return this.attachImageUrls(updated!.toObject() as any);
  }
}
