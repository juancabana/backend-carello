import { Injectable } from '@nestjs/common';
import {
  ProductRepository,
  type ProductFilter,
} from '../../domain/repositories/product.repository.js';
import type { ProductEntity } from '../../domain/entities/product.entity.js';

@Injectable()
export class GetAllProductsUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async execute(filter?: ProductFilter): Promise<ProductEntity[]> {
    return this.repo.getAll(filter);
  }
}
