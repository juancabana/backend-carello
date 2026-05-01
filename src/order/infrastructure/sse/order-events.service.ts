import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter } from 'events';

export interface OrderUpdateEvent {
  type: 'status_changed' | 'driver_assigned';
  orderId: string;
  code: string;
  status?: string;
  driver?: string | null;
}

@Injectable()
export class OrderEventsService implements OnModuleDestroy {
  private readonly emitter = new EventEmitter();

  constructor() {
    this.emitter.setMaxListeners(100); // allow many SSE connections
  }

  emit(event: OrderUpdateEvent): void {
    this.emitter.emit('order_update', event);
  }

  subscribe(listener: (event: OrderUpdateEvent) => void): () => void {
    this.emitter.on('order_update', listener);
    return () => this.emitter.off('order_update', listener);
  }

  onModuleDestroy(): void {
    this.emitter.removeAllListeners();
  }
}
