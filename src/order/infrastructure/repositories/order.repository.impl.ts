import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  OrderRepository,
  type CreateOrderData,
} from '../../domain/repositories/order.repository.js';
import type { OrderEntity } from '../../domain/entities/order.entity.js';
import { OrderOrmEntity } from '../orm/order.orm-entity.js';

function toEntity(o: OrderOrmEntity): OrderEntity {
  return {
    id: o.id,
    code: o.code,
    customerName: o.customerName,
    phone: o.phone,
    address: o.address,
    notes: o.notes,
    items: o.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      name: i.name,
      quantity: i.quantity,
      price: i.price,
    })),
    subtotal: o.subtotal,
    shipping: o.shipping,
    total: o.total,
    paymentMethod: o.paymentMethod,
    status: o.status,
    driver: o.driver,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

function generateCode(): string {
  return `CRL-${Math.floor(1000 + Math.random() * 9000)}`;
}

@Injectable()
export class OrderRepositoryImpl extends OrderRepository {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly repo: Repository<OrderOrmEntity>,
  ) {
    super();
  }

  async create(data: CreateOrderData): Promise<OrderEntity> {
    let code: string;
    let attempts = 0;
    do {
      code = generateCode();
      attempts++;
      if (attempts > 10)
        throw new Error('Could not generate unique order code');
    } while (await this.repo.findOne({ where: { code } }));

    const order = this.repo.create({
      id: code.toLowerCase(),
      code,
      customerName: data.customerName,
      phone: data.phone,
      address: data.address,
      notes: data.notes ?? null,
      subtotal: data.subtotal,
      shipping: data.shipping,
      total: data.total,
      paymentMethod: data.paymentMethod,
      status: 'pendiente',
      driver: null,
      items: data.items.map((i) => ({
        id: undefined as unknown as string,
        productId: i.productId,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        order: undefined as unknown as OrderOrmEntity,
      })),
    });
    const saved = await this.repo.save(order);
    return toEntity(saved);
  }

  async findAll(): Promise<OrderEntity[]> {
    const orders = await this.repo.find({ order: { createdAt: 'DESC' } });
    return orders.map(toEntity);
  }

  async findByCode(code: string): Promise<OrderEntity | null> {
    const order = await this.repo.findOne({
      where: { code: code.trim().toUpperCase() },
    });
    return order ? toEntity(order) : null;
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const order = await this.repo.findOne({ where: { id } });
    return order ? toEntity(order) : null;
  }

  async updateStatus(id: string, status: string): Promise<OrderEntity> {
    const order = await this.repo.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Pedido ${id} no encontrado`);
    order.status = status;
    const saved = await this.repo.save(order);
    return toEntity(saved);
  }

  async updateDriver(id: string, driver: string | null): Promise<OrderEntity> {
    const order = await this.repo.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Pedido ${id} no encontrado`);
    order.driver = driver;
    const saved = await this.repo.save(order);
    return toEntity(saved);
  }
}
