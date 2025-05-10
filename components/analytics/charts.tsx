"use client"

import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartGrid,
  ChartLine,
  ChartXAxis,
  ChartYAxis,
  ChartBar,
  ChartPie,
} from "@/components/ui/chart"

// 模拟数据 - 折线图
const lineChartData = [
  { date: "05-01", orders: 45, amount: 4500 },
  { date: "05-02", orders: 52, amount: 5200 },
  { date: "05-03", orders: 49, amount: 4900 },
  { date: "05-04", orders: 63, amount: 6300 },
  { date: "05-05", orders: 58, amount: 5800 },
  { date: "05-06", orders: 72, amount: 7200 },
  { date: "05-07", orders: 68, amount: 6800 },
  { date: "05-08", orders: 55, amount: 5500 },
  { date: "05-09", orders: 60, amount: 6000 },
  { date: "05-10", orders: 75, amount: 7500 },
  { date: "05-11", orders: 80, amount: 8000 },
  { date: "05-12", orders: 65, amount: 6500 },
  { date: "05-13", orders: 70, amount: 7000 },
  { date: "05-14", orders: 85, amount: 8500 },
]

// 模拟数据 - 柱状图
const barChartData = [
  { date: "05-01", value: 45 },
  { date: "05-02", value: 52 },
  { date: "05-03", value: 49 },
  { date: "05-04", value: 63 },
  { date: "05-05", value: 58 },
  { date: "05-06", value: 72 },
  { date: "05-07", value: 68 },
  { date: "05-08", value: 55 },
  { date: "05-09", value: 60 },
  { date: "05-10", value: 75 },
  { date: "05-11", value: 80 },
  { date: "05-12", value: 65 },
  { date: "05-13", value: 70 },
  { date: "05-14", value: 85 },
]

// 模拟数据 - 饼图
const pieChartData = [
  { name: "已支付", value: 45, color: "#4ade80" },
  { name: "待支付", value: 25, color: "#facc15" },
  { name: "已退款", value: 15, color: "#f87171" },
  { name: "已取消", value: 10, color: "#94a3b8" },
  { name: "已过期", value: 5, color: "#64748b" },
]

export function LineChart() {
  return (
    <Chart data={lineChartData}>
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
  )
}

export function BarChart() {
  return (
    <Chart data={barChartData}>
      <ChartContainer>
        <ChartGrid horizontal vertical />
        <ChartXAxis dataKey="date" />
        <ChartYAxis />
        <ChartBar dataKey="value" fill="#3b82f6" name="数量" />
        <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <ChartTooltipContent>
                  <div className="font-medium">{payload[0].payload.date}</div>
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#3b82f6]" />
                    <span className="text-sm text-muted-foreground">数量:</span>
                    <span className="font-medium">{payload[0].value}</span>
                  </div>
                </ChartTooltipContent>
              )
            }
            return null
          }}
        />
      </ChartContainer>
    </Chart>
  )
}

export function PieChart() {
  return (
    <Chart data={pieChartData}>
      <ChartContainer>
        <ChartPie
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          cornerRadius={4}
          colors={pieChartData.map((item) => item.color)}
        />
        <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <ChartTooltipContent>
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
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
      </ChartContainer>
    </Chart>
  )
}
