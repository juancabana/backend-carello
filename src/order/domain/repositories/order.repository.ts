import type { OrderEntity } from '../entities/order.entity.js';

export interface CreateOrderData {
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  paymentMethod: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
}

export abstract class OrderRepository {
  abstract create(data: CreateOrderData): Promise<OrderEntity>;
  abstract findAll(): Promise<OrderEntity[]>;
  abstract findByCode(code: string): Promise<OrderEntity | null>;
  abstract findById(id: string): Promise<OrderEntity | null>;
  abstract updateStatus(id: string, status: string): Promise<OrderEntity>;
  abstract updateDriver(
    id: string,
    driver: string | null,
  ): Promise<OrderEntity>;
}
