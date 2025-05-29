import { getAuthToken } from "@/lib/auth-utils"

// API基础URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

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
    const error = await response.json().catch(() => ({ detail: "请求失败" }))
    throw new Error(error.detail || `请求失败: ${response.status}`)
  }

  const res = await response.json()
  return res.data
}

// 分析数据类型
export interface AnalyticsTimeRange {
  start_date: string
  end_date: string
}

export interface OrderSummary {
  total_orders: number
  total_amount: number
  average_amount: number
  completed_orders: number
  completion_rate: number
}

export interface PaymentMethodStats {
  method: string
  count: number
  amount: number
  percentage: number
}

export interface DailyStats {
  date: string
  orders: number
  amount: number
  refunds: number
  refund_amount: number
}

export interface RefundStats {
  total_refunds: number
  total_refund_amount: number
  refund_rate: number
  average_refund_amount: number
}

export interface AnalyticsDashboard {
  order_summary: OrderSummary
  payment_methods: PaymentMethodStats[]
  daily_stats: DailyStats[]
  refund_stats: RefundStats
}

// 分析API服务
export const analyticsApi = {
  // 获取仪表板数据
  async getDashboardData(timeRange: AnalyticsTimeRange): Promise<AnalyticsDashboard> {
    return apiFetch("/analytics/dashboard", {
      method: "POST",
      body: JSON.stringify(timeRange),
    })
  },

  // 获取订单统计
  async getOrderStats(timeRange: AnalyticsTimeRange): Promise<OrderSummary> {
    return apiFetch("/analytics/orders", {
      method: "POST",
      body: JSON.stringify(timeRange),
    })
  },

  // 获取支付方式统计
  async getPaymentMethodStats(timeRange: AnalyticsTimeRange): Promise<PaymentMethodStats[]> {
    return apiFetch("/analytics/payment-methods", {
      method: "POST",
      body: JSON.stringify(timeRange),
    })
  },

  // 获取每日统计
  async getDailyStats(timeRange: AnalyticsTimeRange): Promise<DailyStats[]> {
    return apiFetch("/analytics/daily", {
      method: "POST",
      body: JSON.stringify(timeRange),
    })
  },

  // 获取退款统计
  async getRefundStats(timeRange: AnalyticsTimeRange): Promise<RefundStats> {
    return apiFetch("/analytics/refunds", {
      method: "POST",
      body: JSON.stringify(timeRange),
    })
  },

  // 导出数据
  async exportData(timeRange: AnalyticsTimeRange, format: "csv" | "excel" | "pdf"): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/analytics/export`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ ...timeRange, format }),
    })

    if (!response.ok) {
      throw new Error(`导出失败: ${response.status}`)
    }

    return response.blob()
  },
}
