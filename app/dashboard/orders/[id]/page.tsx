import type { Metadata } from "next"
import { OrderDetail } from "@/components/orders/order-detail"

export const metadata: Metadata = {
  title: "订单详情 - 支付集成管理系统",
  description: "查看订单详细信息",
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">订单详情</h2>
        <p className="text-muted-foreground">查看订单详细信息和状态</p>
      </div>
      <OrderDetail orderId={params.id} />
    </div>
  )
}
