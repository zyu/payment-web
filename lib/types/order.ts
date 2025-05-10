export type PaymentType = "wechat" | "alipay";

export type OrderStatus =
  | "CREATED"
  | "PENDING"
  | "PAID"
  | "CANCELLED"
  | "EXPIRED"
  | "REFUND_APPLYING"
  | "REFUND_FAILED"
  | "REFUNDED_PARTIAL"
  | "REFUNDED"
  | "FAILED";

export interface Order {
  id: string;
  orderNumber: string;
  productName: string;
  amount: number;
  status: OrderStatus;
  paymentMethod?: PaymentType;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  refundedAt?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
}

export interface OrderListResponse {
  items: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateOrderRequest {
  productName: string;
  description?: string;
  amount: number;
  paymentMethod: PaymentType;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
}
