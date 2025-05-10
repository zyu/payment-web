import type { Metadata } from "next"
import { CreateOrderForm } from "@/components/orders/create-order-form"

export const metadata: Metadata = {
  title: "创建订单 - 支付集成管理系统",
  description: "创建新的支付订单",
}

export default function CreateOrderPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">创建订单</h2>
        <p className="text-muted-foreground">创建新的支付订单</p>
      </div>
      <CreateOrderForm />
    </div>
  )
}
