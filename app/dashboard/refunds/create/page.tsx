import type { Metadata } from "next"
import { CreateRefundForm } from "@/components/refunds/create-refund-form"

export const metadata: Metadata = {
  title: "申请退款 - 支付集成管理系统",
  description: "为订单申请退款",
}

export default function CreateRefundPage({
  searchParams,
}: {
  searchParams: { orderId?: string }
}) {
  const orderId = searchParams.orderId || ""

  if (!orderId) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">申请退款</h2>
          <p className="text-muted-foreground">为订单申请退款</p>
        </div>
        <div className="rounded-md border border-destructive p-4 text-destructive">
          <p>错误：缺少订单ID参数</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">申请退款</h2>
        <p className="text-muted-foreground">为订单申请退款</p>
      </div>
      <CreateRefundForm orderId={orderId} />
    </div>
  )
}
