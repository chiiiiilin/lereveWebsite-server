import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class VariantDto {
  @ApiProperty({ description: '口味' })
  @IsString()
  @IsNotEmpty()
  flavor: string;

  @ApiProperty({ description: '尺寸' })
  @IsString()
  @IsOptional()
  size: string;

  @ApiProperty({ description: '圖片url', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageKeys: string[];

  @ApiProperty({ description: '價格' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '庫存', default: 0 })
  @IsNumber()
  @IsOptional()
  stock: number;

  @ApiProperty({ description: '是否上架', default: true })
  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;
}

export class CreateProductDto {
  @ApiProperty({
    description: '名稱',
    required: true,
    default: '',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: '介紹',
    required: false,
    default: '',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: '圖片url',
    type: [String],
    default: [],
  })
  @IsArray()
  @IsString({ each: true })
  imageKeys: string[];

  @ApiProperty({
    description: '是否上架',
    required: true,
    default: true,
  })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({
    description: '商品規格',
    type: [VariantDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  @IsOptional()
  variants: VariantDto[];
}
