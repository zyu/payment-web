"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartPie, ChartLegend } from "@/components/ui/chart"

// 模拟数据
const data = [
  { name: "已支付", value: 45, color: "#4ade80" },
  { name: "待支付", value: 25, color: "#facc15" },
  { name: "已退款", value: 15, color: "#f87171" },
  { name: "已取消", value: 10, color: "#94a3b8" },
  { name: "已过期", value: 5, color: "#64748b" },
]

export function OrderStatusChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>订单状态分布</CardTitle>
        <CardDescription>各状态订单占比</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <Chart data={data}>
            <ChartContainer>
              <ChartPie
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                cornerRadius={4}
                colors={data.map((item) => item.color)}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltipContent>
                        <div className="flex items-center gap-1">
                          <div
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: payload[0].payload.color }}
                          />
                          <span className="font-medium">{payload[0].name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-muted-foreground">占比:</span>
                          <span className="font-medium">{payload[0].value}%</span>
                        </div>
                      </ChartTooltipContent>
                    )
                  }
                  return null
                }}
              />
              <ChartLegend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                iconType="circle"
                iconSize={10}
                formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
              />
            </ChartContainer>
          </Chart>
        </div>
      </CardContent>
    </Card>
  )
}
