import { Badge } from "@/components/ui/badge"
import type { PaymentMethod } from "@/lib/types/order"

interface PaymentMethodBadgeProps {
  method: PaymentMethod
}

export function PaymentMethodBadge({ method }: PaymentMethodBadgeProps) {
  const getVariant = () => {
    switch (method) {
      case "wechat":
        return "outline"
      case "alipay":
        return "outline"
      default:
        return "outline"
    }
  }
  switch (method) {
    case "wechat":
      return (
        <Badge variant={getVariant() as any} className="bg-emerald-50 text-emerald-700 border-emerald-200">
          微信支付
        </Badge>
      )
    case "alipay":
      return (
        <Badge variant={getVariant() as any} className="bg-blue-50 text-blue-700 border-blue-200">
          支付宝
        </Badge>
      )
    default:
      return <Badge variant="outline">未知方式</Badge>
  }
}
