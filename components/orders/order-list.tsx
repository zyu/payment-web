"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { PaymentMethodBadge } from "@/components/orders/payment-method-badge"
import { orderApi, type Order } from "@/app/services/api-service"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Search } from "lucide-react"

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState("desc")
  const limit = 10
  const { toast } = useToast()

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await orderApi.getOrders({
        status: statusFilter || undefined,
        search: searchTerm || undefined,
        sortBy,
        sortOrder,
        page: currentPage,
        limit,
      })

      setOrders(data.orders)
      setTotalPages(data.pagination.total_pages)
    } catch (err) {
      console.error("Failed to fetch orders:", err)
      setError("获取订单列表失败")
      toast({
        title: "错误",
        description: "获取订单列表失败",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [currentPage, statusFilter, sortBy, sortOrder])

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchOrders()
      } else {
        setCurrentPage(1)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  return (
    <Card>
      <CardHeader>
        <CardTitle>订单列表</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 搜索和过滤器 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="搜索订单..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="订单状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="pending">待支付</SelectItem>
              <SelectItem value="paid">已支付</SelectItem>
              <SelectItem value="cancelled">已取消</SelectItem>
              <SelectItem value="refunded">已退款</SelectItem>
              <SelectItem value="failed">支付失败</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={(value) => {
              const [field, order] = value.split("-")
              setSortBy(field)
              setSortOrder(order)
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-desc">创建时间 ↓</SelectItem>
              <SelectItem value="created_at-asc">创建时间 ↑</SelectItem>
              <SelectItem value="amount-desc">金额 ↓</SelectItem>
              <SelectItem value="amount-asc">金额 ↑</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center p-4">加载中...</div>
        ) : error ? (
          <div className="text-red-500 p-4">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>订单ID</TableHead>
                    <TableHead>金额</TableHead>
                    <TableHead>商品</TableHead>
                    <TableHead>支付方式</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        暂无订单
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>¥{Number(order.amount).toFixed(2)}</TableCell>
                        <TableCell>{order.items.map((item) => item.name).join(", ")}</TableCell>
                        <TableCell>
                          <PaymentMethodBadge type={order.payment_method} />
                        </TableCell>
                        <TableCell>
                          <OrderStatusBadge status={order.status} />
                        </TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleString("zh-CN")}</TableCell>
                        <TableCell>
                          <Link href={`/dashboard/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              查看
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* 分页 */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                第 {currentPage} 页，共 {totalPages} 页
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  上一页
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  下一页
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
