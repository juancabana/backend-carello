import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsIn,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsInt,
  Min,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class PlaceOrderDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  customerName!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  phone!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  address!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsIn(['transferencia', 'efectivo'])
  paymentMethod!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
