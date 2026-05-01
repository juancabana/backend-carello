export interface OrderLineItemEntity {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderEntity {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string | null;
  items: OrderLineItemEntity[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: string;
  driver?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
