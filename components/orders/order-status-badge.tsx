import { Badge } from "@/components/ui/badge"

interface OrderStatusBadgeProps {
  status: string
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case "CREATED":
        return "secondary"
      case "PENDING":
        return "outline"
      case "PAID":
        return "default"
      case "CANCELLED":
        return "destructive"
      case "EXPIRED":
        return "destructive"
      case "REFUND_APPLYING":
        return "warning"
      case "REFUND_FAILED":
        return "destructive"
      case "REFUNDED":
        return "secondary"
      case "REFUNDED_PARTIAL":
        return "warning"
      case "FAILED":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getLabel = () => {
    switch (status) {
      case "CREATED":
        return "已创建"
      case "PENDING":
        return "待支付"
      case "PAID":
        return "已支付"
      case "CANCELLED":
        return "已取消"
      case "EXPIRED":
        return "已过期"
      case "REFUND_APPLYING":
        return "退款中"
      case "REFUND_FAILED":
        return "退款失败"
      case "REFUNDED":
        return "已退款"
      case "REFUNDED_PARTIAL":
        return "部分退款"
      case "FAILED":
        return "支付失败"
      default:
        return status
    }
  }

  return (
    <Badge variant={getVariant() as any}>
      {getLabel()}
    </Badge>
  )
}