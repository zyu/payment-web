import { getAuthToken } from "@/lib/auth-utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// 统计数据类型定义
export interface TimeRangeParams {
  start_date?: string
  end_date?: string
  time_range?:
    | "today"
    | "yesterday"
    | "last_7_days"
    | "last_30_days"
    | "this_month"
    | "last_month"
    | "this_year"
    | "last_year"
}

export interface OrderOverview {
  total_orders: number
  order_status_distribution: Record<string, number>
  total_revenue: number
  average_order_value: number
  payment_method_distribution: Record<string, number>
  refund_statistics: {
    total_refunds: number
    total_refund_amount: number
    refund_rate: number
  }
}

export interface TrendData {
  date: string
  order_count: number
  revenue: number
}

export interface ProductStatistics {
  product_name: string
  quantity_sold: number
  revenue: number
  average_price: number
}

export interface RefundAnalysis {
  overview: {
    total_refunds: number
    total_refund_amount: number
    refund_rate: number
  }
  reason_distribution: Record<string, number>
  trends: {
    date: string
    refund_count: number
    refund_amount: number
  }[]
}

export interface PaymentMethodAnalysis {
  distribution: Record<string, number>
  trends: {
    date: string
    payment_method: string
    count: number
    amount: number
  }[]
  success_rates: Record<string, number>
}

export interface UserBehaviorAnalysis {
  new_vs_returning: {
    new_users: number
    returning_users: number
  }
  purchase_frequency: Record<string, number>
  average_order_value: number
  customer_lifetime_value: number
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

  return response.json()
}

// 统计分析API服务
export const statisticsApi = {
  // 获取订单概览
  async getOrderOverview(params: TimeRangeParams = {}): Promise<OrderOverview> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })

    return apiFetch(`/statistics/overview?${queryParams.toString()}`)
  },

  // 获取订单趋势
  async getOrderTrends(
    params: TimeRangeParams & {
      granularity?: "day" | "week" | "month"
    } = {},
  ): Promise<TrendData[]> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })

    return apiFetch(`/statistics/trends?${queryParams.toString()}`)
  },

  // 获取商品销售统计
  async getProductStatistics(
    params: TimeRangeParams & {
      sort_by?: "quantity" | "revenue"
      sort_order?: "asc" | "desc"
      limit?: number
    } = {},
  ): Promise<ProductStatistics[]> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })

    return apiFetch(`/statistics/products?${queryParams.toString()}`)
  },

  // 获取退款分析
  async getRefundAnalysis(
    params: TimeRangeParams & {
      granularity?: "day" | "week" | "month"
    } = {},
  ): Promise<RefundAnalysis> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })

    return apiFetch(`/statistics/refunds?${queryParams.toString()}`)
  },

  // 获取支付方式分析
  async getPaymentMethodAnalysis(
    params: TimeRangeParams & {
      granularity?: "day" | "week" | "month"
    } = {},
  ): Promise<PaymentMethodAnalysis> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })

    return apiFetch(`/statistics/payments?${queryParams.toString()}`)
  },

  // 获取用户购买行为分析
  async getUserBehaviorAnalysis(params: TimeRangeParams = {}): Promise<UserBehaviorAnalysis> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })

    return apiFetch(`/statistics/users?${queryParams.toString()}`)
  },

  // 获取自定义报表
  async getCustomReport(params: {
    start_date?: string
    end_date?: string
    time_range?: string
    metrics: string[]
    dimensions?: string[]
    filters?: any[]
    sort?: any[]
    limit?: number
  }): Promise<any> {
    return apiFetch("/statistics/custom", {
      method: "POST",
      body: JSON.stringify(params),
    })
  },

  // 导出统计数据
  async exportStatistics(params: {
    start_date?: string
    end_date?: string
    time_range?: string
    report_type:
      | "order_overview"
      | "order_trends"
      | "product_statistics"
      | "refund_analysis"
      | "payment_method_analysis"
    format?: "csv" | "excel" | "json"
    granularity?: "day" | "week" | "month"
  }): Promise<{ download_url: string }> {
    return apiFetch("/statistics/export", {
      method: "POST",
      body: JSON.stringify(params),
    })
  },
}
