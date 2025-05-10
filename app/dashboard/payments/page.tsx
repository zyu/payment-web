import type { Metadata } from "next"
import { PaymentList } from "@/components/payments/payment-list"

export const metadata: Metadata = {
  title: "支付处理 - 支付集成管理系统",
  description: "处理订单支付，查看支付状态和详情",
}

export default function PaymentsPage() {
  return (
    <div className="space-y-4 w-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">支付处理</h2>
        <p className="text-muted-foreground">处理订单支付，查看支付状态和详情</p>
      </div>
      <PaymentList />
    </div>
  )
}
