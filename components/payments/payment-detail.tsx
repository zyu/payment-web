"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Check, CreditCard, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PaymentMethodBadge } from "@/components/orders/payment-method-badge"
import type { Payment } from "@/lib/types/payment"

// 模拟数据
const paymentDetail: Payment = {
  id: "1",
  orderId: "1",
  orderNumber: "ORD-001",
  transactionId: "WX123456789",
  amount: 299,
  method: "wechat",
  status: "SUCCESS",
  createdAt: "2023-05-01 14:30:00",
  updatedAt: "2023-05-01 14:35:00",
  paidAt: "2023-05-01 14:35:00",
  qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com/pay/wx123456789",
}

interface PaymentDetailProps {
  paymentId: string
}

export function PaymentDetail({ paymentId }: PaymentDetailProps) {
  const [isLoading, setIsLoading] = useState(false)

  // 在实际应用中，这里应该根据paymentId从API获取支付详情
  const payment = paymentDetail

  const handleQueryStatus = async () => {
    setIsLoading(true)
    try {
      // 这里应该调用API查询支付状态
      console.log("查询支付状态:", paymentId)

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 刷新页面或更新状态
      window.location.reload()
    } catch (error) {
      console.error("查询支付状态失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/payments">
            <ArrowLeft className="mr-2 h-4 w-4" /> 返回支付列表
          </Link>
        </Button>

        {payment.status === "PENDING" && (
          <Button variant="outline" size="sm" onClick={handleQueryStatus} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "查询中..." : "查询支付状态"}
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>支付信息</CardTitle>
            <CardDescription>支付详细信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">订单号</p>
                <p className="font-medium">{payment.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">状态</p>
                <p className="flex items-center gap-1 font-medium">
                  {payment.status === "SUCCESS" && (
                    <>
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span className="text-emerald-500">支付成功</span>
                    </>
                  )}
                  {payment.status === "PENDING" && (
                    <>
                      <RefreshCw className="h-4 w-4 text-amber-500" />
                      <span className="text-amber-500">处理中</span>
                    </>
                  )}
                  {payment.status === "FAILED" && (
                    <>
                      <X className="h-4 w-4 text-rose-500" />
                      <span className="text-rose-500">支付失败</span>
                    </>
                  )}
                  {payment.status === "EXPIRED" && (
                    <>
                      <X className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-500">已过期</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">金额</p>
                <p className="font-medium">¥{payment.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">支付方式</p>
                <PaymentMethodBadge method={payment.method} />
              </div>
            </div>

            {payment.transactionId && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">交易ID</p>
                <p className="font-medium">{payment.transactionId}</p>
              </div>
            )}

            {payment.errorMessage && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">错误信息</p>
                <p className="text-rose-500">{payment.errorMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {payment.qrCodeUrl && payment.status === "PENDING" && (
          <Card>
            <CardHeader>
              <CardTitle>支付二维码</CardTitle>
              <CardDescription>使用{payment.method === "wechat" ? "微信" : "支付宝"}扫描二维码完成支付</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="relative h-48 w-48 overflow-hidden rounded-lg border p-2">
                <Image src={payment.qrCodeUrl || "/placeholder.svg"} alt="支付二维码" fill className="object-contain" />
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                请使用{payment.method === "wechat" ? "微信" : "支付宝"}扫描上方二维码完成支付
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>支付时间线</CardTitle>
          <CardDescription>支付状态变更历史</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <Calendar className="h-4 w-4 text-blue-700" />
              </div>
              <div>
                <p className="font-medium">支付创建</p>
                <p className="text-sm text-muted-foreground">{payment.createdAt}</p>
              </div>
            </div>

            {payment.paidAt && (
              <>
                <Separator />
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                    <CreditCard className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-medium">支付完成</p>
                    <p className="text-sm text-muted-foreground">{payment.paidAt}</p>
                  </div>
                </div>
              </>
            )}

            {payment.expiredAt && (
              <>
                <Separator />
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                    <X className="h-4 w-4 text-slate-700" />
                  </div>
                  <div>
                    <p className="font-medium">支付过期</p>
                    <p className="text-sm text-muted-foreground">{payment.expiredAt}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-4">
          <p className="text-sm text-muted-foreground">最后更新时间: {payment.updatedAt}</p>
        </CardFooter>
      </Card>
    </div>
  )
}
