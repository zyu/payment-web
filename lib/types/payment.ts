import type { PaymentMethod } from "./order"

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED"

export interface Payment {
  id: string
  orderId: string
  orderNumber: string
  transactionId?: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  createdAt: string
  updatedAt: string
  paidAt?: string
  expiredAt?: string
  qrCodeUrl?: string
  errorMessage?: string
}

export interface PaymentListResponse {
  items: Payment[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CreatePaymentRequest {
  orderId: string
  method: PaymentMethod
}
