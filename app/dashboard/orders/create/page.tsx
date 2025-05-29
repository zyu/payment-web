"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { orderApi, type PaymentMethod, type OrderItem } from "@/app/services/api-service"
import { useToast } from "@/hooks/use-toast"

export default function CreateOrderPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userId, setUserId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wechat")
  const [items, setItems] = useState<Array<{ name: string; price: string; quantity: number }>>([
    { name: "", price: "", quantity: 1 },
  ])
  const { toast } = useToast()

  const addItem = () => {
    setItems([...items, { name: "", price: "", quantity: 1 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof OrderItem | "price", value: string | number) => {
    setItems(
      items.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    )
  }

  const calculateSubtotal = () => {
    return items
      .reduce((total, item) => {
        const price = Number.parseFloat(item.price) || 0
        return total + price * item.quantity
      }, 0)
      .toFixed(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 验证表单
      if (!userId.trim()) {
        throw new Error("请输入用户ID")
      }

      if (items.some((item) => !item.name.trim() || !item.price || Number.parseFloat(item.price) <= 0)) {
        throw new Error("请填写完整的商品信息")
      }

      // 准备订单数据
      const orderItems: OrderItem[] = items.map((item) => ({
        name: item.name.trim(),
        price: Number.parseFloat(item.price),
        quantity: item.quantity,
      }))

      const orderData = {
        amount: Number.parseFloat(calculateSubtotal()),
        items: orderItems,
        payment_method: paymentMethod,
      }

      // 调用API创建订单
      const result = await orderApi.createOrder(orderData)

      toast({
        title: "成功",
        description: "订单创建成功",
      })

      // 跳转到订单详情页
      router.push(`/dashboard/orders/${result.order_id}`)
    } catch (error) {
      console.error("创建订单失败", error)
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "创建订单失败",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Link href="/dashboard/orders">
          <Button variant="outline" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">创建订单</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>输入订单的基本信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">用户ID</Label>
                <Input
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="请输入用户ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">支付方式</Label>
                <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="选择支付方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alipay">支付宝</SelectItem>
                    <SelectItem value="wechat">微信支付</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>订单汇总</CardTitle>
              <CardDescription>订单金额汇总</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>商品数量:</span>
                  <span>{items.length} 种</span>
                </div>
                <div className="flex justify-between">
                  <span>总数量:</span>
                  <span>{items.reduce((sum, item) => sum + item.quantity, 0)} 件</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>总金额:</span>
                  <span>¥{calculateSubtotal()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>订单明细</CardTitle>
            <CardDescription>添加订单中的商品</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid gap-4 grid-cols-12 items-end">
                <div className="col-span-5 space-y-2">
                  <Label htmlFor={`item-name-${index}`}>商品名称</Label>
                  <Input
                    id={`item-name-${index}`}
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    placeholder="输入商品名称"
                    required
                  />
                </div>
                <div className="col-span-3 space-y-2">
                  <Label htmlFor={`item-price-${index}`}>单价</Label>
                  <Input
                    id={`item-price-${index}`}
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(index, "price", e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="col-span-3 space-y-2">
                  <Label htmlFor={`item-quantity-${index}`}>数量</Label>
                  <Input
                    id={`item-quantity-${index}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addItem} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              添加商品
            </Button>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/orders")}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "创建中..." : "创建订单"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
