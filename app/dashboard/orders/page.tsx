"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { orderApi, type Order } from "@/app/services/api-service"
import { useToast } from "@/hooks/use-toast"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState("desc")
  const limit = 10
  const { toast } = useToast()

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
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
    } catch (error) {
      console.error("获取订单失败", error)
      toast({
        title: "错误",
        description: "获取订单失败",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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

  const getStatusClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "refunded":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "failed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getPaymentMethodClass = (method: string) => {
    switch (method) {
      case "alipay":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "wechat":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "待支付"
      case "paid":
        return "已支付"
      case "cancelled":
        return "已取消"
      case "refunded":
        return "已退款"
      case "failed":
        return "支付失败"
      default:
        return status
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "alipay":
        return "支付宝"
      case "wechat":
        return "微信支付"
      default:
        return method
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">订单管理</h1>
        <Link href="/dashboard/orders/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            创建订单
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">所有订单</TabsTrigger>
          <TabsTrigger value="paid">已支付</TabsTrigger>
          <TabsTrigger value="pending">待支付</TabsTrigger>
          <TabsTrigger value="cancelled">已取消</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>订单列表</CardTitle>
              <CardDescription>管理和查看所有订单信息</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4 gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="search"
                    placeholder="搜索订单..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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

              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>订单ID</TableHead>
                          <TableHead>用户ID</TableHead>
                          <TableHead>金额</TableHead>
                          <TableHead>商品</TableHead>
                          <TableHead>支付方式</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>创建时间</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders && orders.length > 0 ? (
                          orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.user_id}</TableCell>
                              <TableCell>¥{Number(order.amount).toFixed(2)}</TableCell>
                              <TableCell>
                                {Array.isArray(order.items) && order.items.length > 0
                                  ? order.items.map((item) => item.name).join(", ")
                                  : "无商品信息"}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodClass(order.payment_method)}`}
                                >
                                  {getPaymentMethodText(order.payment_method)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}
                                >
                                  {getStatusText(order.status)}
                                </span>
                              </TableCell>
                              <TableCell>{new Date(order.created_at).toLocaleString("zh-CN")}</TableCell>
                              <TableCell className="text-right">
                                <Link href={`/dashboard/orders/${order.id}`}>
                                  <Button variant="outline" size="sm">
                                    查看
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-4">
                              没有找到订单
                            </TableCell>
                          </TableRow>
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
        </TabsContent>

        {/* 其他标签页内容 */}
        {["paid", "pending", "cancelled"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{getStatusText(status)}订单</CardTitle>
                <CardDescription>查看所有{getStatusText(status)}的订单</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => {
                    setStatusFilter(status)
                    // 切换到"所有订单"标签页以显示过滤结果
                    document.querySelector('[value="all"]')?.click()
                  }}
                >
                  查看{getStatusText(status)}订单
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
