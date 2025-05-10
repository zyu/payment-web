"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartPie, ChartLegend } from "@/components/ui/chart"

// 模拟数据
const data = [
  { name: "微信支付", value: 65, color: "#4ade80" },
  { name: "支付宝", value: 35, color: "#3b82f6" },
]

export function PaymentMethodChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>支付方式占比</CardTitle>
        <CardDescription>各支付方式使用占比</CardDescription>
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
