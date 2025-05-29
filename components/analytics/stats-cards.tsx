"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, CreditCard, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  analyticsApi,
  type AnalyticsTimeRange,
  type OrderSummary,
  type RefundStats,
} from "@/app/services/analytics-service"
import { Skeleton } from "@/components/ui/skeleton"

interface StatsCardsProps {
  timeRange: AnalyticsTimeRange
  onRefresh?: () => void
}

export function StatsCards({ timeRange, onRefresh }: StatsCardsProps) {
  const [orderStats, setOrderStats] = useState<OrderSummary | null>(null)
  const [refundStats, setRefundStats] = useState<RefundStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [orderData, refundData] = await Promise.all([
          analyticsApi.getOrderStats(timeRange),
          analyticsApi.getRefundStats(timeRange),
        ])
        setOrderStats(orderData)
        setRefundStats(refundData)
        if (onRefresh) onRefresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "获取数据失败")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange, onRefresh])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-[100px]" />
              </CardTitle>
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px]" />
              <Skeleton className="h-4 w-[80px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !orderStats || !refundStats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">{error || "数据加载失败"}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">总订单金额</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">¥{orderStats.total_amount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">共 {orderStats.total_orders} 笔订单</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">平均订单金额</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">¥{orderStats.average_amount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">完成率 {(orderStats.completion_rate * 100).toFixed(2)}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">退款总额</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">¥{refundStats.total_refund_amount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">共 {refundStats.total_refunds} 笔退款</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">退款率</CardTitle>
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(refundStats.refund_rate * 100).toFixed(2)}%</div>
          <p className="text-xs text-muted-foreground">平均退款 ¥{refundStats.average_refund_amount.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  )
}
