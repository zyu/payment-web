// app/services/api-service.ts
import { getAuthToken } from "@/lib/auth-utils";

// API基础URL
const API_BASE_URL =
  process.env.BACKEND_API_URL || "http://localhost:8000/api";

// 订单类型
export type PaymentType = "wechat" | "alipay";

export type OrderStatus =
  | "created"
  | "pending"
  | "paid"
  | "cancelled"
  | "refund_applying"
  | "refund_failed"
  | "refunded_partial"
  | "refunded"
  | "failed";

export interface Order {
  order_id: string;
  amount: number;
  title: string;
  description?: string;
  user_id: string;
  payment_type: PaymentType;
  status: OrderStatus;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
  paid_at?: string;
  refund_id?: string;
  refund_amount?: number;
  refund_reason?: string;
  refund_status?: string;
  refund_time?: string;
}

export interface WechatPaymentParams {
  appId: string;
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}

export interface AlipayPaymentParams {
  trade_no: string;
  form_html: string;
}

export interface RefundRequest {
  amount: number;
  reason: string;
}

// API请求通用函数
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "请求失败" }));
    throw new Error(error.detail || `请求失败: ${response.status}`);
  }

  return response.json();
};

// 订单API服务
export const orderApi = {
  // 创建订单
  async createOrder(orderData: {
    amount: number;
    title: string;
    description?: string;
    user_id: string;
    payment_type: PaymentType;
  }): Promise<Order> {
    return apiFetch("/orders/", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  // 获取订单详情
  async getOrderById(orderId: string): Promise<Order> {
    return await apiFetch(`/orders/${orderId}`);
  },

  // 获取用户订单列表
  async getUserOrders(
    userId: string,
    skip: number = 0,
    limit: number = 100
  ): Promise<Order[]> {
    return apiFetch(`/orders?skip=${skip}&limit=${limit}`);
  },

  // 发起微信支付
  async createWechatPayment(
    orderId: string,
    openid?: string
  ): Promise<{ payment_params: WechatPaymentParams }> {
    const body = openid ? { openid } : {};
    return apiFetch(`/payment/wechat/pay/${orderId}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // 查询微信支付状态
  async queryWechatPayment(orderId: string): Promise<{
    order_id: string;
    transaction_id?: string;
    status: OrderStatus;
    paid_at?: string;
    updated_at: string;
  }> {
    return apiFetch(`/payment/wechat/query/${orderId}`);
  },

  // 发起支付宝支付
  async createAlipayPayment(
    orderId: string,
    returnUrl?: string
  ): Promise<{ payment_params: AlipayPaymentParams }> {
    const body = returnUrl ? { return_url: returnUrl } : {};
    return apiFetch(`/payment/alipay/pay/${orderId}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // 获取支付宝表单支付链接
  getAlipayFormUrl(orderId: string, returnUrl?: string): string {
    const queryParams = returnUrl
      ? `?return_url=${encodeURIComponent(returnUrl)}`
      : "";
    return `${API_BASE_URL}/payment/alipay/pay/${orderId}/form${queryParams}`;
  },

  // 查询支付宝支付状态
  async queryAlipayPayment(orderId: string): Promise<{
    alipay_query_result: {
      code: string;
      msg: string;
      trade_no?: string;
      out_trade_no: string;
      trade_status?: string;
    };
    order_status: OrderStatus;
  }> {
    return apiFetch(`/payment/alipay/query/${orderId}`);
  },

  // 申请退款
  async createRefund(
    orderId: string,
    refundData: RefundRequest
  ): Promise<{
    order: {
      order_id: string;
      status: OrderStatus;
      refund_id?: string;
      refund_amount?: number;
      refund_status?: string;
    };
    result: any;
  }> {
    return apiFetch(`/refund/${orderId}`, {
      method: "POST",
      body: JSON.stringify(refundData),
    });
  },

  // 查询退款状态
  async queryRefundStatus(orderId: string): Promise<{
    order: {
      order_id: string;
      status: OrderStatus;
      refund_id?: string;
      refund_amount?: number;
      refund_status?: string;
      refund_time?: string;
    };
    result: any;
  }> {
    return apiFetch(`/refund/${orderId}/status`);
  },
};
