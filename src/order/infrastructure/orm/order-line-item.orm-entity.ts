import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { OrderOrmEntity } from './order.orm-entity.js';

@Entity('order_line_items')
export class OrderLineItemOrmEntity {
  @PrimaryColumn({ type: 'uuid', default: () => 'gen_random_uuid()' })
  id!: string;

  @Index()
  @ManyToOne(() => OrderOrmEntity, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order!: OrderOrmEntity;

  @Column({ name: 'product_id', type: 'varchar', length: 50 })
  productId!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'integer' })
  quantity!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  price!: number;
}
