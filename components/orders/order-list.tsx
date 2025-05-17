"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUpDown, Eye, MoreHorizontal, Plus, RefreshCcw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { PaymentMethodBadge } from "@/components/orders/payment-method-badge"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// 定义与后端对应的类型
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
  prepay_id?: string;
  trade_type?: string;
  mweb_url?: string;
  created_at: string;
  updated_at: string;
  paid_at?: string;
  notify_data?: string;
  refund_id?: string;
  refund_amount?: number;
  refund_reason?: string;
  refund_status?: string;
  refund_time?: string;
}

// 订单API服务
const orderApi = {
  // 获取用户的订单列表
  async getUserOrders(userId: string, skip: number = 0, limit: number = 20): Promise<Order[]> {
    try {
      const response = await fetch(`/api/orders?skip=${skip}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // 获取单个订单详情
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  // 创建订单
  async createOrder(orderData: {
    amount: number;
    title: string;
    description?: string;
    user_id: string;
    payment_type: PaymentType;
  }): Promise<Order> {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
};

// 格式化状态，将后端状态映射到前端展示状态
const mapOrderStatus = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    'created': 'CREATED',
    'pending': 'PENDING',
    'paid': 'PAID',
    'cancelled': 'CANCELLED',
    'refund_applying': 'REFUND_APPLYING',
    'refund_failed': 'REFUND_FAILED',
    'refunded_partial': 'REFUNDED_PARTIAL',
    'refunded': 'REFUNDED',
    'failed': 'FAILED'
  };
  return statusMap[status] || status.toUpperCase();
};

// 格式化日期时间
const formatDateTime = (dateTimeStr: string): string => {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export function OrderList() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [sorting, setSorting] = useState<{ column: keyof Order; direction: "asc" | "desc" }>({
    column: "created_at",
    direction: "desc",
  })

  // 获取当前用户ID（假设从认证上下文或本地存储中获取）
  const getCurrentUserId = (): string => {
    // 实际应用中，您可能会从认证上下文或localStorage中获取
    // 这里仅作示例，您需要根据您的认证系统修改
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : '';
  };

  // 加载订单数据
  const loadOrders = async () => {
    try {
      setLoading(true);
      const userId = getCurrentUserId();
      if (!userId) {
        // 如果用户未登录，重定向到登录页面
        router.push('/login');
        return;
      }
      
      const ordersData = await orderApi.getUserOrders(userId);
      setOrders(ordersData);
      setError(null);
    } catch (err) {
      setError('获取订单数据失败');
      toast({
        title: "错误",
        description: "获取订单列表失败，请稍后再试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取订单
  useEffect(() => {
    loadOrders();
  }, []);

  // 过滤订单
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // 排序订单
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const aValue = a[sorting.column];
    const bValue = b[sorting.column];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sorting.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sorting.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    return 0;
  });

  // 排序处理函数
  const handleSort = (column: keyof Order) => {
    setSorting((prev) => ({
      column,
      direction: prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // 刷新订单列表
  const refreshOrders = () => {
    loadOrders();
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="搜索订单号或商品名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            prefix={<Search className="h-4 w-4 text-muted-foreground" />}
          />
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="状态筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部状态</SelectItem>
              <SelectItem value="created">已创建</SelectItem>
              <SelectItem value="pending">待支付</SelectItem>
              <SelectItem value="paid">已支付</SelectItem>
              <SelectItem value="cancelled">已取消</SelectItem>
              <SelectItem value="failed">支付失败</SelectItem>
              <SelectItem value="refund_applying">申请退款中</SelectItem>
              <SelectItem value="refunded">已退款</SelectItem>
              <SelectItem value="refunded_partial">部分退款</SelectItem>
              <SelectItem value="refund_failed">退款失败</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={refreshOrders}>
            <RefreshCcw className="mr-2 h-4 w-4" /> 刷新
          </Button>
          <Button asChild>
            <Link href="/dashboard/orders/create">
              <Plus className="mr-2 h-4 w-4" /> 创建订单
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-600">
          {error}
          <Button variant="outline" className="ml-4" onClick={refreshOrders}>
            重试
          </Button>
        </div>
      ) : (
        <div className="rounded-md border w-full overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">
                    <div className="flex items-center space-x-1" onClick={() => handleSort("order_id")}>
                      <span>订单号</span>
                      <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                    </div>
                  </TableHead>
                  <TableHead>商品名称</TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-1" onClick={() => handleSort("amount")}>
                      <span>金额</span>
                      <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                    </div>
                  </TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>支付方式</TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-1" onClick={() => handleSort("created_at")}>
                      <span>创建时间</span>
                      <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                    </div>
                  </TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      没有找到符合条件的订单
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedOrders.map((order) => (
                    <TableRow key={order.order_id}>
                      <TableCell className="font-medium">{order.order_id}</TableCell>
                      <TableCell>{order.title}</TableCell>
                      <TableCell>¥{order.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <OrderStatusBadge status={mapOrderStatus(order.status)} />
                      </TableCell>
                      <TableCell>{order.payment_type && <PaymentMethodBadge method={order.payment_type} />}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDateTime(order.created_at)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">操作</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/orders/${order.order_id}`}>
                                <Eye className="mr-2 h-4 w-4" /> 查看详情
                              </Link>
                            </DropdownMenuItem>
                            {order.status === "paid" && (
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/refunds/create?orderId=${order.order_id}`}>
                                  <RefreshCcw className="mr-2 h-4 w-4" /> 申请退款
                                </Link>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}