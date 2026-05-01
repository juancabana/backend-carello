import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { OrderRepository } from '../../domain/repositories/order.repository.js';
import { ProductRepository } from '../../../catalog/domain/repositories/product.repository.js';
import { OrderEventsService } from '../../infrastructure/sse/order-events.service.js';
import { SHIPPING_FLAT_RATE } from '../../../shared/constants/shipping.js';
import type { PlaceOrderDto } from '../dtos/place-order.dto.js';
import type { OrderEntity } from '../../domain/entities/order.entity.js';

@Injectable()
export class PlaceOrderUseCase {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly productRepo: ProductRepository,
    private readonly events: OrderEventsService,
  ) {}

  async execute(dto: PlaceOrderDto): Promise<OrderEntity> {
    // Fetch all products once, then resolve each item
    const allProducts = await this.productRepo.getAll();
    const productMap = new Map(allProducts.map((p) => [p.id, p]));

    const resolvedItems = dto.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new UnprocessableEntityException(
          `Producto '${item.productId}' no encontrado`,
        );
      }
      if (!product.available) {
        throw new UnprocessableEntityException(
          `Producto '${product.name}' no está disponible`,
        );
      }
      return {
        productId: item.productId,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const subtotal = resolvedItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );
    const shipping = SHIPPING_FLAT_RATE;
    const total = parseFloat((subtotal + shipping).toFixed(2));

    const order = await this.orderRepo.create({
      customerName: dto.customerName,
      phone: dto.phone,
      address: dto.address,
      notes: dto.notes,
      paymentMethod: dto.paymentMethod,
      items: resolvedItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping,
      total,
    });

    this.events.emit({
      type: 'status_changed',
      orderId: order.id,
      code: order.code,
      status: order.status,
    });

    return order;
  }
}
