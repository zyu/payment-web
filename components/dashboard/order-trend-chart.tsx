"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartGrid,
  ChartLine,
  ChartXAxis,
  ChartYAxis,
} from "@/components/ui/chart"

// 模拟数据
const weeklyData = [
  { date: "周一", orders: 45, amount: 4500 },
  { date: "周二", orders: 52, amount: 5200 },
  { date: "周三", orders: 49, amount: 4900 },
  { date: "周四", orders: 63, amount: 6300 },
  { date: "周五", orders: 58, amount: 5800 },
  { date: "周六", orders: 72, amount: 7200 },
  { date: "周日", orders: 68, amount: 6800 },
]

const monthlyData = [
  { date: "1月", orders: 320, amount: 32000 },
  { date: "2月", orders: 350, amount: 35000 },
  { date: "3月", orders: 410, amount: 41000 },
  { date: "4月", orders: 450, amount: 45000 },
  { date: "5月", orders: 480, amount: 48000 },
  { date: "6月", orders: 520, amount: 52000 },
]

export function OrderTrendChart() {
  const [period, setPeriod] = useState("weekly")
  const data = period === "weekly" ? weeklyData : monthlyData

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>订单趋势</CardTitle>
          <CardDescription>订单数量和交易金额趋势</CardDescription>
        </div>
        <Tabs defaultValue="weekly" value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="weekly">周</TabsTrigger>
            <TabsTrigger value="monthly">月</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Chart data={data}>
            <ChartContainer>
              <ChartGrid horizontal vertical />
              <ChartYAxis />
              <ChartXAxis dataKey="date" />
              <ChartLine dataKey="orders" name="订单数量" stroke="#3b82f6" strokeWidth={2} dot={{ strokeWidth: 2 }} />
              <ChartLine
                dataKey="amount"
                name="交易金额(¥)"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
                yAxisId="right"
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltipContent>
                        <div className="font-medium">{payload[0].payload.date}</div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#3b82f6]" />
                            <span className="text-sm text-muted-foreground">订单数量:</span>
                            <span className="font-medium">{payload[0].value}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                            <span className="text-sm text-muted-foreground">交易金额:</span>
                            <span className="font-medium">¥{payload[1].value}</span>
                          </div>
                        </div>
                      </ChartTooltipContent>
                    )
                  }
                  return null
                }}
              />
            </ChartContainer>
          </Chart>
        </div>
      </CardContent>
    </Card>
  )
}
