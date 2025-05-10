import type { Metadata } from "next"
import { RefundList } from "@/components/refunds/refund-list"

export const metadata: Metadata = {
  title: "退款管理 - 支付集成管理系统",
  description: "管理订单退款，查看退款状态和详情",
}

export default function RefundsPage() {
  return (
    <div className="space-y-4 w-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">退款管理</h2>
        <p className="text-muted-foreground">管理订单退款，查看退款状态和详情</p>
      </div>
      <RefundList />
    </div>
  )
}
