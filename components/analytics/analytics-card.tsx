import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AnalyticsCardProps {
  title: string
  value: string
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function AnalyticsCard({ title, value, description, trend, className }: AnalyticsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && (
          <div className="mt-2 flex items-center text-xs">
            <span className={cn("mr-1", trend.isPositive ? "text-emerald-500" : "text-rose-500")}>
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground">相比上周期</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
