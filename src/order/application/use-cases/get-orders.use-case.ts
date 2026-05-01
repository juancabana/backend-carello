import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../domain/repositories/order.repository.js';
import type { OrderEntity } from '../../domain/entities/order.entity.js';

@Injectable()
export class GetOrdersUseCase {
  constructor(private readonly repo: OrderRepository) {}

  async execute(): Promise<OrderEntity[]> {
    return this.repo.findAll();
  }
}
