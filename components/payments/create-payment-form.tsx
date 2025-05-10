"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Order } from "@/lib/types/order"

// 模拟数据
const order: Order = {
  id: "1",
  orderNumber: "ORD-001",
  productName: "高级会员套餐",
  description: "包含所有高级功能的会员套餐，有效期一年。",
  amount: 299,
  status: "CREATED",
  createdAt: "2023-05-01 14:30:00",
  updatedAt: "2023-05-01 14:30:00",
  customerName: "张三",
  customerPhone: "13800138000",
}

const formSchema = z.object({
  paymentMethod: z.enum(["wechat", "alipay"], {
    required_error: "请选择支付方式",
  }),
})

interface CreatePaymentFormProps {
  orderId: string
}

export function CreatePaymentForm({ orderId }: CreatePaymentFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 在实际应用中，这里应该根据orderId从API获取订单详情
  const orderDetail = order

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "wechat",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // 这里应该调用API创建支付
      console.log("创建支付:", { orderId, ...values })

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 成功后跳转到支付详情页
      router.push("/dashboard/payments/1") // 实际应用中应该跳转到新创建的支付ID
      router.refresh()
    } catch (error) {
      console.error("创建支付失败:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>创建支付</CardTitle>
        <CardDescription>为订单 {orderDetail.orderNumber} 创建支付</CardDescription>
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
              <p className="text-sm font-medium text-muted-foreground">金额</p>
              <p className="font-medium">¥{orderDetail.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">客户</p>
              <p className="font-medium">{orderDetail.customerName}</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>支付方式</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择支付方式" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="wechat">微信支付</SelectItem>
                      <SelectItem value="alipay">支付宝</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>选择您想要使用的支付方式</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="flex justify-between px-0">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "创建中..." : "创建支付"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
