"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Order } from "@/lib/types/order"

// 模拟数据
const order: Order = {
  id: "1",
  orderNumber: "ORD-001",
  productName: "高级会员套餐",
  description: "包含所有高级功能的会员套餐，有效期一年。",
  amount: 299,
  status: "PAID",
  paymentMethod: "wechat",
  createdAt: "2023-05-01 14:30:00",
  updatedAt: "2023-05-01 14:35:00",
  paidAt: "2023-05-01 14:35:00",
  customerName: "张三",
  customerPhone: "13800138000",
}

const formSchema = z.object({
  amount: z.coerce
    .number()
    .positive({
      message: "金额必须大于0",
    })
    .refine((val) => val <= order.amount, {
      message: "退款金额不能大于订单金额",
    }),
  reason: z
    .string()
    .min(2, {
      message: "退款原因至少需要2个字符",
    })
    .max(200, {
      message: "退款原因不能超过200个字符",
    }),
})

interface CreateRefundFormProps {
  orderId: string
}

export function CreateRefundForm({ orderId }: CreateRefundFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 在实际应用中，这里应该根据orderId从API获取订单详情
  const orderDetail = order

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: orderDetail.amount,
      reason: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // 这里应该调用API创建退款
      console.log("创建退款:", { orderId, ...values })

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 成功后跳转到退款列表页
      router.push("/dashboard/refunds")
      router.refresh()
    } catch (error) {
      console.error("创建退款失败:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>申请退款</CardTitle>
        <CardDescription>为订单 {orderDetail.orderNumber} 申请退款</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 rounded-lg border p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">订单号</p>
              <p className="font-medium">{orderDetail.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">商品名称</p>
              <p className="font-medium">{orderDetail.productName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">订单金额</p>
              <p className="font-medium">¥{orderDetail.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">支付方式</p>
              <p className="font-medium">{orderDetail.paymentMethod === "wechat" ? "微信支付" : "支付宝"}</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>退款金额</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="输入退款金额" {...field} />
                  </FormControl>
                  <FormDescription>退款金额不能超过订单金额 ¥{orderDetail.amount.toFixed(2)}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>退款原因</FormLabel>
                  <FormControl>
                    <Textarea placeholder="请输入退款原因" {...field} />
                  </FormControl>
                  <FormDescription>简要说明退款原因，不超过200个字符</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="flex justify-between px-0">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "提交中..." : "申请退款"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
