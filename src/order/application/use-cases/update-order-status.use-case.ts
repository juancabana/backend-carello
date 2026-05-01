import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../domain/repositories/order.repository.js';
import { OrderEventsService } from '../../infrastructure/sse/order-events.service.js';
import type { OrderEntity } from '../../domain/entities/order.entity.js';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    private readonly repo: OrderRepository,
    private readonly events: OrderEventsService,
  ) {}

  async execute(id: string, status: string): Promise<OrderEntity> {
    const order = await this.repo.updateStatus(id, status);
    this.events.emit({
      type: 'status_changed',
      orderId: order.id,
      code: order.code,
      status,
    });
    return order;
  }
}
