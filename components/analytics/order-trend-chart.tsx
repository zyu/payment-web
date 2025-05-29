"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { analyticsApi, type AnalyticsTimeRange, type DailyStats } from "@/app/services/analytics-service"
import { Skeleton } from "@/components/ui/skeleton"

interface OrderTrendChartProps {
  timeRange: AnalyticsTimeRange
  onRefresh?: () => void
}

export function OrderTrendChart({ timeRange, onRefresh }: OrderTrendChartProps) {
  const [data, setData] = useState<DailyStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const dailyStats = await analyticsApi.getDailyStats(timeRange)
        setData(dailyStats)
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
      <Card>
        <CardHeader>
          <CardTitle>订单趋势</CardTitle>
          <CardDescription>每日订单数量和金额趋势</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <Skeleton className="w-full h-[300px]" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>订单趋势</CardTitle>
          <CardDescription>每日订单数量和金额趋势</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>订单趋势</CardTitle>
        <CardDescription>每日订单数量和金额趋势</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ChartContainer
          config={{
            orders: {
              label: "订单数量",
              color: "hsl(var(--chart-1))",
            },
            amount: {
              label: "订单金额 (¥)",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="orders"
                stroke="var(--color-orders)"
                name="订单数量"
                activeDot={{ r: 8 }}
              />
              <Line yAxisId="right" type="monotone" dataKey="amount" stroke="var(--color-amount)" name="订单金额 (¥)" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
