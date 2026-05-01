import type { ProductEntity } from '../entities/product.entity.js';

export interface ProductFilter {
  category?: string;
  available?: boolean;
}

export abstract class ProductRepository {
  abstract getAll(filter?: ProductFilter): Promise<ProductEntity[]>;
  abstract getBySlug(slug: string): Promise<ProductEntity | null>;
}
