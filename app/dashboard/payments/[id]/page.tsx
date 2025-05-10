import type { Metadata } from "next"
import { PaymentDetail } from "@/components/payments/payment-detail"

export const metadata: Metadata = {
  title: "支付详情 - 支付集成管理系统",
  description: "查看支付详细信息",
}

export default function PaymentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">支付详情</h2>
        <p className="text-muted-foreground">查看支付详细信息和状态</p>
      </div>
      <PaymentDetail paymentId={params.id} />
    </div>
  )
}
