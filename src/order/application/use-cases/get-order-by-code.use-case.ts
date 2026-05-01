import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../../domain/repositories/order.repository.js';
import type { OrderEntity } from '../../domain/entities/order.entity.js';

@Injectable()
export class GetOrderByCodeUseCase {
  constructor(private readonly repo: OrderRepository) {}

  async execute(code: string): Promise<OrderEntity> {
    const order = await this.repo.findByCode(code);
    if (!order) throw new NotFoundException(`Pedido ${code} no encontrado`);
    return order;
  }
}
