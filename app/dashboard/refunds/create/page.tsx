"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { orderApi, refundApi } from "@/app/services/api-service"
import { useToast } from "@/hooks/use-toast"

export default function CreateRefundPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrderId, setSelectedOrderId] = useState<string>("")
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [refundAmount, setRefundAmount] = useState("")
  const [refundReason, setRefundReason] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { toast } = useToast()

  // 获取可退款的订单列表
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        // 获取已支付的订单
        const data = await orderApi.getOrders({ status: "paid" })
        setOrders(data.orders)

        // 如果URL中有order参数，预选该订单
        const orderIdFromUrl = searchParams.get("order")
        if (orderIdFromUrl) {
          setSelectedOrderId(orderIdFromUrl)
          const order = data.orders.find((o: any) => o.id === orderIdFromUrl)
          if (order) {
            setSelectedOrder(order)
            setRefundAmount(order.amount.toString())
          }
        }
      } catch (error) {
        console.error("获取订单失败", error)
        setError("获取可退款订单失败，请稍后再试")
        toast({
          title: "错误",
          description: "获取可退款订单失败",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [searchParams, toast])

  // 当选择订单时，设置最大可退款金额
  const handleOrderSelect = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (order) {
      setSelectedOrderId(orderId)
      setSelectedOrder(order)
      setRefundAmount(order.amount.toString()) // 默认设置为全额退款
    }
  }

  // 验证退款金额
  const validateRefundAmount = (amount: string) => {
    const numAmount = Number.parseFloat(amount)
    if (isNaN(numAmount)) {
      return "请输入有效的退款金额"
    }
    if (numAmount <= 0) {
      return "退款金额必须大于0"
    }
    if (selectedOrder && numAmount > selectedOrder.amount) {
      return `退款金额不能超过订单金额 ¥${selectedOrder.amount}`
    }
    return null
  }

  // 处理退款金额变更
  const handleRefundAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRefundAmount(e.target.value)
    setError(null)
  }

  // 提交退款申请
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // 验证表单
    if (!selectedOrderId) {
      setError("请选择要退款的订单")
      return
    }

    const amountError = validateRefundAmount(refundAmount)
    if (amountError) {
      setError(amountError)
      return
    }

    if (!refundReason.trim()) {
      setError("请输入退款原因")
      return
    }

    setIsSubmitting(true)

    try {
      // 提交退款申请
      const result = await refundApi.createRefund({
        order_id: selectedOrderId,
        amount: Number.parseFloat(refundAmount),
        reason: refundReason,
      })

      setSuccess("退款申请已成功提交，请等待审核")

      // 清空表单
      setSelectedOrderId("")
      setSelectedOrder(null)
      setRefundAmount("")
      setRefundReason("")

      // 3秒后跳转到退款列表页面
      setTimeout(() => {
        router.push("/dashboard/refunds")
      }, 3000)
    } catch (error) {
      console.error("申请退款失败", error)
      setError(error instanceof Error ? error.message : "申请退款失败，请稍后再试")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Link href="/dashboard/refunds">
          <Button variant="outline" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">申请退款</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>退款申请表</CardTitle>
          <CardDescription>请填写退款信息并提交申请</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>错误</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                <AlertTitle>成功</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="order">选择订单</Label>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">加载订单中...</span>
                </div>
              ) : orders.length > 0 ? (
                <Select value={selectedOrderId} onValueChange={handleOrderSelect}>
                  <SelectTrigger id="order">
                    <SelectValue placeholder="选择要退款的订单" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.id} - ¥{Number(order.amount).toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-muted-foreground">没有可退款的订单</div>
              )}
            </div>

            {selectedOrder && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="orderDetails">订单详情</Label>
                  <div className="rounded-md border p-4 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-medium">订单ID：</span>
                        {selectedOrder.id}
                      </div>
                      <div>
                        <span className="font-medium">用户ID：</span>
                        {selectedOrder.user_id}
                      </div>
                      <div>
                        <span className="font-medium">创建日期：</span>
                        {new Date(selectedOrder.created_at).toLocaleString("zh-CN")}
                      </div>
                      <div>
                        <span className="font-medium">金额：</span>¥{selectedOrder.amount}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refundAmount">退款金额</Label>
                  <Input
                    id="refundAmount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={selectedOrder.amount}
                    value={refundAmount}
                    onChange={handleRefundAmountChange}
                    placeholder="输入退款金额"
                    required
                  />
                  <p className="text-xs text-muted-foreground">最大可退款金额：¥{selectedOrder.amount}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refundReason">退款原因</Label>
                  <Select onValueChange={setRefundReason}>
                    <SelectTrigger id="refundReason">
                      <SelectValue placeholder="选择退款原因" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="商品质量问题">商品质量问题</SelectItem>
                      <SelectItem value="商品与描述不符">商品与描述不符</SelectItem>
                      <SelectItem value="收到错误商品">收到错误商品</SelectItem>
                      <SelectItem value="客户不满意">客户不满意</SelectItem>
                      <SelectItem value="其他原因">其他原因</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {refundReason === "其他原因" && (
                  <div className="space-y-2">
                    <Label htmlFor="refundReasonDetail">详细原因</Label>
                    <Textarea
                      id="refundReasonDetail"
                      placeholder="请详细描述退款原因"
                      value={refundReason !== "其他原因" ? refundReason : ""}
                      onChange={(e) => setRefundReason(e.target.value)}
                      required
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/refunds")}>
              取消
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading || !selectedOrder || !refundAmount || !refundReason}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  提交中...
                </>
              ) : (
                "提交退款申请"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
