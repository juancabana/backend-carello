import { IsOptional, IsIn, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class ProductFilterDto {
  @IsOptional()
  @IsIn(['helados', 'sorbetes', 'postres', 'bebidas'])
  category?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  available?: boolean;
}
