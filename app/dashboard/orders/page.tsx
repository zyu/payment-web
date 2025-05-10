import type { Metadata } from "next"
import { OrderList } from "@/components/orders/order-list"

export const metadata: Metadata = {
  title: "订单管理 - 支付集成管理系统",
  description: "管理所有订单，查看订单状态和详情",
}

export default function OrdersPage() {
  return (
    <div className="space-y-4 w-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">订单管理</h2>
        <p className="text-muted-foreground">管理所有订单，查看订单状态和详情</p>
      </div>
      <OrderList />
    </div>
  )
}
