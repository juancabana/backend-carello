import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from './infrastructure/orm/product.orm-entity.js';
import { ProductRepositoryImpl } from './infrastructure/repositories/product.repository.impl.js';
import { ProductRepository } from './domain/repositories/product.repository.js';
import { GetAllProductsUseCase } from './application/use-cases/get-all-products.use-case.js';
import { GetProductBySlugUseCase } from './application/use-cases/get-product-by-slug.use-case.js';
import { CatalogController } from './presentation/catalog.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [CatalogController],
  providers: [
    { provide: ProductRepository, useClass: ProductRepositoryImpl },
    GetAllProductsUseCase,
    GetProductBySlugUseCase,
  ],
  exports: [ProductRepository],
})
export class CatalogModule {}
