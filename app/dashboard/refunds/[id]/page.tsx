import type { Metadata } from "next"
import { RefundDetail } from "@/components/refunds/refund-detail"

export const metadata: Metadata = {
  title: "退款详情 - 支付集成管理系统",
  description: "查看退款详细信息",
}

export default function RefundDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">退款详情</h2>
        <p className="text-muted-foreground">查看退款详细信息和状态</p>
      </div>
      <RefundDetail refundId={params.id} />
    </div>
  )
}
