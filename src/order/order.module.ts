import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderOrmEntity } from './infrastructure/orm/order.orm-entity.js';
import { OrderLineItemOrmEntity } from './infrastructure/orm/order-line-item.orm-entity.js';
import { OrderRepositoryImpl } from './infrastructure/repositories/order.repository.impl.js';
import { OrderRepository } from './domain/repositories/order.repository.js';
import { OrderEventsService } from './infrastructure/sse/order-events.service.js';
import { PlaceOrderUseCase } from './application/use-cases/place-order.use-case.js';
import { GetOrdersUseCase } from './application/use-cases/get-orders.use-case.js';
import { GetOrderByCodeUseCase } from './application/use-cases/get-order-by-code.use-case.js';
import { UpdateOrderStatusUseCase } from './application/use-cases/update-order-status.use-case.js';
import { AssignDriverUseCase } from './application/use-cases/assign-driver.use-case.js';
import { OrderController } from './presentation/order.controller.js';
import { CatalogModule } from '../catalog/catalog.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderOrmEntity, OrderLineItemOrmEntity]),
    CatalogModule,
  ],
  controllers: [OrderController],
  providers: [
    { provide: OrderRepository, useClass: OrderRepositoryImpl },
    OrderEventsService,
    PlaceOrderUseCase,
    GetOrdersUseCase,
    GetOrderByCodeUseCase,
    UpdateOrderStatusUseCase,
    AssignDriverUseCase,
  ],
})
export class OrderModule {}
