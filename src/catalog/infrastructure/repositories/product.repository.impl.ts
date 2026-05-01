import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ProductRepository,
  type ProductFilter,
} from '../../domain/repositories/product.repository.js';
import type { ProductEntity } from '../../domain/entities/product.entity.js';
import { ProductOrmEntity } from '../orm/product.orm-entity.js';

@Injectable()
export class ProductRepositoryImpl extends ProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repo: Repository<ProductOrmEntity>,
  ) {
    super();
  }

  async getAll(filter?: ProductFilter): Promise<ProductEntity[]> {
    const qb = this.repo.createQueryBuilder('p');
    if (filter?.category)
      qb.andWhere('p.category = :category', { category: filter.category });
    if (filter?.available !== undefined)
      qb.andWhere('p.available = :available', { available: filter.available });
    qb.orderBy('p.name', 'ASC');
    return qb.getMany();
  }

  async getBySlug(slug: string): Promise<ProductEntity | null> {
    return this.repo.findOne({ where: { slug } });
  }
}
