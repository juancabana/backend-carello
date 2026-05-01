import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { PlaceOrderUseCase } from '../application/use-cases/place-order.use-case.js';
import { GetOrdersUseCase } from '../application/use-cases/get-orders.use-case.js';
import { GetOrderByCodeUseCase } from '../application/use-cases/get-order-by-code.use-case.js';
import { UpdateOrderStatusUseCase } from '../application/use-cases/update-order-status.use-case.js';
import { AssignDriverUseCase } from '../application/use-cases/assign-driver.use-case.js';
import { OrderEventsService } from '../infrastructure/sse/order-events.service.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles } from '../../shared/decorators/roles.decorator.js';
import { PlaceOrderDto } from '../application/dtos/place-order.dto.js';
import { UpdateStatusDto } from '../application/dtos/update-status.dto.js';
import { AssignDriverDto } from '../application/dtos/assign-driver.dto.js';
import type { OrderUpdateEvent } from '../infrastructure/sse/order-events.service.js';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly placeOrder: PlaceOrderUseCase,
    private readonly getOrders: GetOrdersUseCase,
    private readonly getOrderByCode: GetOrderByCodeUseCase,
    private readonly updateStatus: UpdateOrderStatusUseCase,
    private readonly assignDriver: AssignDriverUseCase,
    private readonly events: OrderEventsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: PlaceOrderDto) {
    return this.placeOrder.execute(dto);
  }

  // SSE endpoint — MUST be registered BEFORE :code to avoid route collision
  @Get('stream')
  stream(
    @Query('code') filterCode: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    res.write('event: connected\ndata: {"message":"connected"}\n\n');

    const unsubscribe = this.events.subscribe((event: OrderUpdateEvent) => {
      if (filterCode && event.code !== filterCode.toUpperCase()) return;
      res.write(`event: order_update\ndata: ${JSON.stringify(event)}\n\n`);
    });

    // Keep-alive every 25 seconds
    const keepAlive = setInterval(() => {
      res.write(': keep-alive\n\n');
    }, 25_000);

    req.on('close', () => {
      clearInterval(keepAlive);
      unsubscribe();
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'cajero')
  findAll() {
    return this.getOrders.execute();
  }

  @Get(':code')
  findByCode(@Param('code') code: string) {
    return this.getOrderByCode.execute(code);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'cajero')
  patchStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.updateStatus.execute(id, dto.status);
  }

  @Patch(':id/driver')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  patchDriver(@Param('id') id: string, @Body() dto: AssignDriverDto) {
    return this.assignDriver.execute(id, dto.driver);
  }
}
