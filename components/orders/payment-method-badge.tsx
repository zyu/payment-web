import { cn } from "@/lib/utils"

interface PaymentMethodBadgeProps {
  type: string
  className?: string
}

export function PaymentMethodBadge({ type, className }: PaymentMethodBadgeProps) {
  const getMethodClass = (method: string) => {
    switch (method) {
      case "alipay":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "wechat":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getMethodText = (method: string) => {
    switch (method) {
      case "alipay":
        return "支付宝"
      case "wechat":
        return "微信支付"
      default:
        return method
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        getMethodClass(type),
        className,
      )}
    >
      {getMethodText(type)}
    </span>
  )
}
