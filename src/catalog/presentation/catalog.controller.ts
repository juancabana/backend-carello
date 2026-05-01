import { Controller, Get, Param, Query, Header } from '@nestjs/common';
import { GetAllProductsUseCase } from '../application/use-cases/get-all-products.use-case.js';
import { GetProductBySlugUseCase } from '../application/use-cases/get-product-by-slug.use-case.js';
import { ProductFilterDto } from '../application/dtos/product-filter.dto.js';

@Controller('products')
export class CatalogController {
  constructor(
    private readonly getAllProducts: GetAllProductsUseCase,
    private readonly getProductBySlug: GetProductBySlugUseCase,
  ) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
  getAll(@Query() filter: ProductFilterDto) {
    return this.getAllProducts.execute(filter);
  }

  @Get(':slug')
  @Header('Cache-Control', 'public, max-age=300')
  getBySlug(@Param('slug') slug: string) {
    return this.getProductBySlug.execute(slug);
  }
}
