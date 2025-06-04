"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Download, Printer } from "lucide-react"
import { orderApi, type Order } from "@/app/services/api-service"
import { useToast } from "@/hooks/use-toast"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { PaymentMethodBadge } from "@/components/orders/payment-method-badge"

interface OrderDetailPageClientProps {
  orderId: string
}

export default function OrderDetailPageClient({ orderId }: OrderDetailPageClientProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setIsLoading(true)
      try {
        const data = await orderApi.getOrderById(orderId)
        setOrder(data)
      } catch (err) {
        console.error("获取订单详情失败:", err)
        setError("获取订单详情失败")
        toast({
          title: "错误",
          description: "获取订单详情失败",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetail()
    }
  }, [orderId, toast])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Link href="/dashboard/orders">
            <Button variant="outline" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">订单详情</h1>
        </div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
          <div className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Link href="/dashboard/orders">
            <Button variant="outline" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">订单详情</h1>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">{error || "未找到订单信息"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 计算订单总金额
  const calculateTotal = () => {
    return order.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard/orders">
            <Button variant="outline" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">订单 #{order.id}</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            打印
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>订单信息</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">订单ID</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{order.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">创建日期</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {new Date(order.created_at).toLocaleString("zh-CN")}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">状态</dt>
                <dd className="mt-1">
                  <OrderStatusBadge status={order.status} />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">支付方式</dt>
                <dd className="mt-1">
                  <PaymentMethodBadge type={order.payment_method} />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">更新日期</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {new Date(order.updated_at).toLocaleString("zh-CN")}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">用户ID</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{order.user_id}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>金额信息</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">订单金额</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">¥{Number(order.amount).toFixed(2)}</dd>
              </div>
              {/* <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">计算金额</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">¥{calculateTotal().toFixed(2)}</dd>
              </div> */}
            </dl>
          </CardContent>
        </Card>
      </div>
{/* 
      <Card>
        <CardHeader>
          <CardTitle>订单明细</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>商品</TableHead>
                <TableHead className="text-right">单价</TableHead>
                <TableHead className="text-right">数量</TableHead>
                <TableHead className="text-right">小计</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">¥{item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">¥{(item.price * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between pt-2 border-t">
              <span className="font-bold">总计</span>
              <span className="font-bold">¥{Number(order.amount).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader>
          <CardTitle>操作</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-2">
          <Button variant="outline">修改订单</Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
            取消订单
          </Button>
          <Link href={`/dashboard/refunds/create?order=${order.id}`}>
            <Button>申请退款</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
