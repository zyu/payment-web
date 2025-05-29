"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { orderApi, type PaymentMethod, type OrderItem } from "@/app/services/api-service"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2 } from "lucide-react"

export function CreateOrderForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wechat")
  const [items, setItems] = useState<Array<{ name: string; price: string; quantity: number }>>([
    { name: "", price: "", quantity: 1 },
  ])

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { name: "", price: "", quantity: 1 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items]
      newItems.splice(index, 1)
      setItems(newItems)
    }
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = Number.parseFloat(item.price) || 0
      return total + price * item.quantity
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 验证表单
    if (!userId) {
      toast({
        title: "错误",
        description: "请输入用户ID",
        variant: "destructive",
      })
      return
    }

    if (items.some((item) => !item.name || !item.price)) {
      toast({
        title: "错误",
        description: "请填写所有商品信息",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // 准备订单数据
      const orderItems = items.map((item) => ({
        name: item.name,
        price: Number.parseFloat(item.price),
        quantity: item.quantity,
      }))

      const orderData = {
        user_id: userId,
        amount: calculateTotal(),
        items: orderItems,
        payment_method: paymentMethod,
      }

      // 创建订单
      const result = await orderApi.createOrder(orderData)

      toast({
        title: "成功",
        description: "订单创建成功",
      })

      // 跳转到订单详情页
      router.push(`/dashboard/orders/${result.order_id}`)
    } catch (error) {
      console.error("Failed to create order:", error)
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "创建订单失败",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>创建新订单</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user_id">用户ID</Label>
            <Input
              id="user_id"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="输入用户ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>支付方式</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wechat" id="wechat" />
                <Label htmlFor="wechat">微信支付</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alipay" id="alipay" />
                <Label htmlFor="alipay">支付宝</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label>订单商品</Label>
            {items.map((item, index) => (
              <div key={index} className="grid gap-4 grid-cols-12 items-end">
                <div className="col-span-5 space-y-2">
                  <Label htmlFor={`item-name-${index}`}>商品名称</Label>
                  <Input
                    id={`item-name-${index}`}
                    value={item.name}
                    onChange={(e) => handleItemChange(index, "name", e.target.value)}
                    placeholder="商品名称"
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
                    onChange={(e) => handleItemChange(index, "price", e.target.value)}
                    placeholder="单价"
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
                    onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value))}
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

            <div className="flex justify-between pt-4 border-t">
              <span className="font-bold">总计</span>
              <span className="font-bold">¥{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "创建中..." : "创建订单"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
