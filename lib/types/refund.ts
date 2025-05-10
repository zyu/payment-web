import type { PaymentMethod } from "./order"

export type RefundStatus = "APPLYING" | "PROCESSING" | "SUCCESS" | "FAILED"

export interface Refund {
  id: string
  orderId: string
  orderNumber: string
  paymentId: string
  transactionId?: string
  refundId?: string
  amount: number
  originalAmount: number
  reason?: string
  method: PaymentMethod
  status: RefundStatus
  createdAt: string
  updatedAt: string
  completedAt?: string
  errorMessage?: string
}

export interface RefundListResponse {
  items: Refund[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CreateRefundRequest {
  orderId: string
  amount: number
  reason?: string
}
