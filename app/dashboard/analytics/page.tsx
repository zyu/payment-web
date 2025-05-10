import type { Metadata } from "next"
import { BarChart, LineChart, PieChart } from "@/components/analytics/charts"
import { AnalyticsCard } from "@/components/analytics/analytics-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "数据分析 - 支付集成管理系统",
  description: "查看订单和支付数据分析",
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">数据分析</h2>
        <p className="text-muted-foreground">查看订单和支付数据分析</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="总订单数"
          value="1,284"
          description="过去30天"
          trend={{ value: 12.5, isPositive: true }}
        />
        <AnalyticsCard
          title="总交易额"
          value="¥128,450"
          description="过去30天"
          trend={{ value: 8.2, isPositive: true }}
        />
        <AnalyticsCard
          title="平均订单金额"
          value="¥100.04"
          description="过去30天"
          trend={{ value: 3.1, isPositive: false }}
        />
        <AnalyticsCard title="退款率" value="4.2%" description="过去30天" trend={{ value: 0.8, isPositive: true }} />
      </div>

      <Tabs defaultValue="orders" className="space-y-4 w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="orders">订单分析</TabsTrigger>
          <TabsTrigger value="payments">支付分析</TabsTrigger>
          <TabsTrigger value="refunds">退款分析</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="w-full">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>订单趋势</CardTitle>
                <CardDescription>过去30天的订单数量和金额趋势</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <LineChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>订单状态分布</CardTitle>
                <CardDescription>各状态订单占比</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart />
              </CardContent>
            </Card>
          </div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>每日订单数量</CardTitle>
              <CardDescription>过去30天每日订单数量</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments" className="w-full">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>支付趋势</CardTitle>
                <CardDescription>过去30天的支付数量和金额趋势</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <LineChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>支付方式分布</CardTitle>
                <CardDescription>各支付方式占比</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart />
              </CardContent>
            </Card>
          </div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>支付成功率</CardTitle>
              <CardDescription>过去30天每日支付成功率</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="refunds" className="w-full">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>退款趋势</CardTitle>
                <CardDescription>过去30天的退款数量和金额趋势</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <LineChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>退款原因分布</CardTitle>
                <CardDescription>各退款原因占比</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart />
              </CardContent>
            </Card>
          </div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>退款处理时间</CardTitle>
              <CardDescription>过去30天退款平均处理时间</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
