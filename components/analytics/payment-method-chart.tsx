"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { analyticsApi, type AnalyticsTimeRange, type PaymentMethodStats } from "@/app/services/analytics-service"
import { Skeleton } from "@/components/ui/skeleton"

interface PaymentMethodChartProps {
  timeRange: AnalyticsTimeRange
  onRefresh?: () => void
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function PaymentMethodChart({ timeRange, onRefresh }: PaymentMethodChartProps) {
  const [data, setData] = useState<PaymentMethodStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const paymentStats = await analyticsApi.getPaymentMethodStats(timeRange)
        setData(paymentStats)
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
          <CardTitle>支付方式分布</CardTitle>
          <CardDescription>各支付方式的订单数量和金额占比</CardDescription>
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
          <CardTitle>支付方式分布</CardTitle>
          <CardDescription>各支付方式的订单数量和金额占比</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  const formatTooltip = (value: number, name: string, props: any) => {
    const item = data[props.payload.index]
    return [`${value.toFixed(2)}%`, `${name}: ${item.count}笔 / ¥${item.amount.toFixed(2)}`]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>支付方式分布</CardTitle>
        <CardDescription>各支付方式的订单数量和金额占比</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="percentage"
              nameKey="method"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={formatTooltip} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
