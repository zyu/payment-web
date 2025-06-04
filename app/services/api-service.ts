// app/services/api-service.ts
import { getAuthToken } from "@/lib/auth-utils"

// API基础URL - 现在指向您的PHP后端
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// 订单类型
export type PaymentMethod = "wechat" | "alipay"
export type PaymentType = "web" | "h5" | "jsapi" | "native"

export type OrderStatus = "pending" | "paid" | "cancelled" | "refunded" | "failed"

export interface Order {
  id: string
  user_id: string
  amount: number
  items: OrderItem[]
  payment_method: PaymentMethod
  status: OrderStatus
  created_at: string
  updated_at: string
}

export interface OrderItem {
  name: string
  quantity: number
  price: number
}

export interface PaymentParams {
  payment_type: PaymentType
  openid?: string
}

export interface RefundRequest {
  order_id: string
  amount: number
  reason: string
  refund_amount: number
}

export interface Refund {
  id: string
  order_id: string
  amount: number
  reason: string
  status: string
  created_at: string
  refunded_at?: string
  error_message?: string
}

// API请求通用函数
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "请求失败" }))
    throw new Error(error.message || `请求失败: ${response.status}`)
  }

  const res = await response.json()
  return res.data
}

// 认证API
export const authApi = {
  // 登录
  async login(credentials: { email: string; password: string }): Promise<{
    user: any
    token: string
  }> {
    const res =  await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
    return res
  },

  // 注册
  async register(userData: { name: string; email: string; password: string }): Promise<{
    user: any
    token: string
  }> {
    return apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },
}

// 订单API服务
export const orderApi = {
  // 获取订单列表
  async getOrders(
    params: {
      status?: string
      search?: string
      sortBy?: string
      sortOrder?: string
      page?: number
      limit?: number
    } = {},
  ): Promise<{
    orders: Order[]
    pagination: {
      current_page: number
      total_pages: number
      total_items: number
      per_page: number
    }
  }> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })

    return apiFetch(`/orders?${queryParams.toString()}`)
  },

  // 获取订单详情
  async getOrderById(orderId: string): Promise<Order> {
    return apiFetch(`/orders/${orderId}`)
  },

  // 创建订单
  async createOrder(orderData: {
    amount: number
    items: OrderItem[]
    payment_method: PaymentMethod
  }): Promise<{ order_id: string }> {
    return apiFetch("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
  },
}

// 支付API服务
export const paymentApi = {
  // 准备支付
  async preparePayment(orderId: string, paymentParams: PaymentParams): Promise<any> {
    return apiFetch(`/payment/prepare/${orderId}`, {
      method: "POST",
      body: JSON.stringify(paymentParams),
    })
  },

  // 查询支付状态
  async getPaymentStatus(orderId: string): Promise<{
    order_id: string
    status: OrderStatus
    transaction_id?: string
    paid_at?: string
  }> {
    return apiFetch(`/payment/status/${orderId}`)
  },
}

// 退款API服务
export const refundApi = {
  // 申请退款
  async createRefund(refundData: RefundRequest): Promise<{
    refund_id: string
    status: string
  }> {
    return apiFetch("/refunds", {
      method: "POST",
      body: JSON.stringify(refundData),
    })
  },

  // 获取退款详情
  async getRefundById(refundId: string): Promise<Refund> {
    return apiFetch(`/refunds/${refundId}`)
  },

  // 获取退款列表
  async getRefunds(
    params: {
      status?: string
      search?: string
      page?: number
      limit?: number
    } = {},
  ): Promise<{
    refunds: Refund[]
    pagination: any
  }> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })

    return apiFetch(`/refunds?${queryParams.toString()}`)
  },
}
