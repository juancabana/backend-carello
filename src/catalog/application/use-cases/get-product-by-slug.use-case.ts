import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository.js';
import type { ProductEntity } from '../../domain/entities/product.entity.js';

@Injectable()
export class GetProductBySlugUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async execute(slug: string): Promise<ProductEntity> {
    const product = await this.repo.getBySlug(slug);
    if (!product)
      throw new NotFoundException(`Producto '${slug}' no encontrado`);
    return product;
  }
}
