import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderLineItemOrmEntity } from './order-line-item.orm-entity.js';

@Entity('orders')
export class OrderOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 10 })
  code!: string;

  @Column({ name: 'customer_name', type: 'varchar', length: 200 })
  customerName!: string;

  @Column({ type: 'varchar', length: 30 })
  phone!: string;

  @Column({ type: 'text' })
  address!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  subtotal!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 2.5,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  shipping!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  total!: number;

  @Column({ name: 'payment_method', type: 'varchar', length: 20 })
  paymentMethod!: string;

  @Index()
  @Column({ type: 'varchar', length: 20, default: 'pendiente' })
  status!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  driver!: string | null;

  @OneToMany(() => OrderLineItemOrmEntity, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items!: OrderLineItemOrmEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
