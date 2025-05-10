import type { Metadata } from "next"
import { CreatePaymentForm } from "@/components/payments/create-payment-form"

export const metadata: Metadata = {
  title: "创建支付 - 支付集成管理系统",
  description: "为订单创建新的支付",
}

export default function CreatePaymentPage({
  searchParams,
}: {
  searchParams: { orderId?: string }
}) {
  const orderId = searchParams.orderId || ""

  if (!orderId) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">创建支付</h2>
          <p className="text-muted-foreground">为订单创建新的支付</p>
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
        <h2 className="text-2xl font-bold tracking-tight">创建支付</h2>
        <p className="text-muted-foreground">为订单创建新的支付</p>
      </div>
      <CreatePaymentForm orderId={orderId} />
    </div>
  )
}
