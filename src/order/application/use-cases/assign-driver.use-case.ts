import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../domain/repositories/order.repository.js';
import { OrderEventsService } from '../../infrastructure/sse/order-events.service.js';
import type { OrderEntity } from '../../domain/entities/order.entity.js';

@Injectable()
export class AssignDriverUseCase {
  constructor(
    private readonly repo: OrderRepository,
    private readonly events: OrderEventsService,
  ) {}

  async execute(id: string, driver: string | null): Promise<OrderEntity> {
    const order = await this.repo.updateDriver(id, driver);
    this.events.emit({
      type: 'driver_assigned',
      orderId: order.id,
      code: order.code,
      driver,
    });
    return order;
  }
}
