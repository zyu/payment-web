"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Printer } from "lucide-react"
import { refundApi, type Refund, orderApi } from "@/app/services/api-service"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

export default function RefundDetailPageClient() {
  const params = useParams()
  const router = useRouter()
  const refundId = params.id as string
  const [refund, setRefund] = useState<Refund | null>(null)
  const [order, setOrder] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchRefundDetail = async () => {
      setIsLoading(true)
      try {
        const refundData = await refundApi.getRefundById(refundId)
        setRefund(refundData)

        // 获取关联的订单信息
        if (refundData.order_id) {
          const orderData = await orderApi.getOrderById(refundData.order_id)
          setOrder(orderData)
        }
      } catch (err) {
        console.error("获取退款详情失败:", err)
        setError("获取退款详情失败")
        toast({
          title: "错误",
          description: "获取退款详情失败",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (refundId) {
      fetchRefundDetail()
    }
  }, [refundId, toast])

   const [inputRefundAmount, setInputRefundAmount] = useState(refund?.amount ?? "")

    useEffect(() => {
      if (refund) {
        setInputRefundAmount(refund.amount)
      }
    }, [refund])

  const getStatusClass = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Link href="/dashboard/refunds">
            <Button variant="outline" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">退款详情</h1>
        </div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
          <div className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
        </div>
      </div>
    )
  }

  if (error || !refund) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Link href="/dashboard/refunds">
            <Button variant="outline" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">退款详情</h1>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">{error || "未找到退款信息"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard/refunds">
            <Button variant="outline" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">退款 #{refund.id}</h1>
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
            <CardTitle>退款信息</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">退款ID</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{refund.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">订单ID</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  <Link href={`/dashboard/orders/${refund.order_id}`} className="text-blue-600 hover:underline">
                    {refund.order_id}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">申请日期</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {new Date(refund.created_at).toLocaleString("zh-CN")}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">状态</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(refund.status)}`}
                  >
                    {refund.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">退款总金额金额</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">¥{refund.amount}</dd>
              </div>
               <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">实际退款金额</dt>
                  <dd className="mt-1">
                    <Input
                      type="number"
                      min={0.01}
                      step={0.01}
                      value={inputRefundAmount}
                      onChange={e => setInputRefundAmount(e.target.value)}
                      className="w-32"
                      placeholder="输入退款金额"
                    />
                  </dd>
                </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">退款原因</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{refund.reason}</dd>
              </div>
              {refund.refunded_at && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">退款完成时间</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {new Date(refund.refunded_at).toLocaleString("zh-CN")}
                  </dd>
                </div>
              )}
              {refund.error_message && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">错误信息</dt>
                  <dd className="mt-1 text-sm text-red-600">{refund.error_message}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {order && (
          <Card>
            <CardHeader>
              <CardTitle>订单信息</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">订单金额</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">¥{Number(order.amount).toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">订单状态</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{order.status}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">创建时间</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {new Date(order.created_at).toLocaleString("zh-CN")}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">支付方式</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{order.payment_method}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>操作</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-2">
          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
            拒绝退款
          </Button>
          <Button>批准退款</Button>
        </CardContent>
      </Card>
    </div>
  )
}
