"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Check, CreditCard, RefreshCw, X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PaymentMethodBadge } from "@/components/orders/payment-method-badge"
import type { Refund } from "@/lib/types/refund"

// 模拟数据
const refundDetail: Refund = {
  id: "1",
  orderId: "1",
  orderNumber: "ORD-001",
  paymentId: "1",
  refundId: "RF123456789",
  amount: 299,
  originalAmount: 299,
  reason: "客户不满意",
  method: "wechat",
  status: "SUCCESS",
  createdAt: "2023-05-02 10:30:00",
  updatedAt: "2023-05-02 10:35:00",
  completedAt: "2023-05-02 10:35:00",
}

interface RefundDetailProps {
  refundId: string
}

export function RefundDetail({ refundId }: RefundDetailProps) {
  const [isLoading, setIsLoading] = useState(false)

  // 在实际应用中，这里应该根据refundId从API获取退款详情
  const refund = refundDetail

  const handleQueryStatus = async () => {
    setIsLoading(true)
    try {
      // 这里应该调用API查询退款状态
      console.log("查询退款状态:", refundId)

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 刷新页面或更新状态
      window.location.reload()
    } catch (error) {
      console.error("查询退款状态失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/refunds">
            <ArrowLeft className="mr-2 h-4 w-4" /> 返回退款列表
          </Link>
        </Button>

        {(refund.status === "APPLYING" || refund.status === "PROCESSING") && (
          <Button variant="outline" size="sm" onClick={handleQueryStatus} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "查询中..." : "查询退款状态"}
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>退款信息</CardTitle>
            <CardDescription>退款详细信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">订单号</p>
                <p className="font-medium">{refund.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">状态</p>
                <p className="flex items-center gap-1 font-medium">
                  {refund.status === "SUCCESS" && (
                    <>
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span className="text-emerald-500">退款成功</span>
                    </>
                  )}
                  {refund.status === "PROCESSING" && (
                    <>
                      <RefreshCw className="h-4 w-4 text-amber-500" />
                      <span className="text-amber-500">处理中</span>
                    </>
                  )}
                  {refund.status === "APPLYING" && (
                    <>
                      <RefreshCw className="h-4 w-4 text-blue-500" />
                      <span className="text-blue-500">申请中</span>
                    </>
                  )}
                  {refund.status === "FAILED" && (
                    <>
                      <X className="h-4 w-4 text-rose-500" />
                      <span className="text-rose-500">退款失败</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">退款金额</p>
                <p className="font-medium">¥{refund.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">原始金额</p>
                <p className="font-medium">¥{refund.originalAmount.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">支付方式</p>
                <PaymentMethodBadge method={refund.method} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">退款类型</p>
                <p className="font-medium">{refund.amount === refund.originalAmount ? "全额退款" : "部分退款"}</p>
              </div>
            </div>

            {refund.refundId && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">退款ID</p>
                <p className="font-medium">{refund.refundId}</p>
              </div>
            )}

            {refund.reason && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">退款原因</p>
                <p className="font-medium">{refund.reason}</p>
              </div>
            )}

            {refund.errorMessage && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">错误信息</p>
                <p className="text-rose-500">{refund.errorMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>相关信息</CardTitle>
            <CardDescription>订单和支付信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" asChild className="justify-start">
                <Link href={`/dashboard/orders/${refund.orderId}`}>
                  <Eye className="mr-2 h-4 w-4" /> 查看订单详情
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="justify-start">
                <Link href={`/dashboard/payments/${refund.paymentId}`}>
                  <Eye className="mr-2 h-4 w-4" /> 查看支付详情
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>退款时间线</CardTitle>
          <CardDescription>退款状态变更历史</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <Calendar className="h-4 w-4 text-blue-700" />
              </div>
              <div>
                <p className="font-medium">退款申请</p>
                <p className="text-sm text-muted-foreground">{refund.createdAt}</p>
              </div>
            </div>

            {refund.completedAt && (
              <>
                <Separator />
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                    <CreditCard className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-medium">退款完成</p>
                    <p className="text-sm text-muted-foreground">{refund.completedAt}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-4">
          <p className="text-sm text-muted-foreground">最后更新时间: {refund.updatedAt}</p>
        </CardFooter>
      </Card>
    </div>
  )
}
