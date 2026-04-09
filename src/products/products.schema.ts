import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: false })
export class Variants {
  @Prop({ required: true })
  flavor: string;

  @Prop()
  size: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ type: [String] })
  imageKeys: string[];

  @Prop({ default: false })
  trashed: boolean;
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [String] })
  imageKeys: string[];

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ type: [Variants], default: [] })
  variants: Variants[];

  @Prop({ default: false })
  trashed: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
