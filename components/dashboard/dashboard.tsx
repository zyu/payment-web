"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainLayout } from "@/components/layout/main-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, Package, RefreshCcw, TrendingUp } from "lucide-react"

// 假设这些组件已经存在
import { OrderTrendChart } from "@/components/dashboard/order-trend-chart"
import { PaymentMethodChart } from "@/components/dashboard/payment-method-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { StatCard } from "@/components/dashboard/stat-card"

interface DashboardStats {
  totalOrders: number
  totalAmount: number
  totalRefunds: number
  refundAmount: number
  completionRate: number
  orderGrowth: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // 在实际应用中，这里应该调用您的PHP后端API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`)
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("获取仪表板数据失败", error)
        // 使用模拟数据作为后备
        setStats({
          totalOrders: 1254,
          totalAmount: 287650.5,
          totalRefunds: 36,
          refundAmount: 8432.2,
          completionRate: 94.5,
          orderGrowth: 12.3,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">仪表板</h1>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="mt-2 h-4 w-16" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <StatCard
                title="总订单数"
                value={stats?.totalOrders || 0}
                description={`增长 ${stats?.orderGrowth || 0}%`}
                icon={Package}
              />
              <StatCard
                title="总金额"
                value={`¥${stats?.totalAmount?.toLocaleString() || 0}`}
                description="本月销售额"
                icon={TrendingUp}
              />
              <StatCard
                title="退款数"
                value={stats?.totalRefunds || 0}
                description={`¥${stats?.refundAmount?.toLocaleString() || 0}`}
                icon={RefreshCcw}
              />
              <StatCard
                title="完成率"
                value={`${stats?.completionRate || 0}%`}
                description="订单完成率"
                icon={BarChart3}
              />
            </>
          )}
        </div>

        {/* 图表和数据 */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="analytics">分析</TabsTrigger>
            <TabsTrigger value="reports">报表</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>订单趋势</CardTitle>
                  <CardDescription>过去30天的订单和销售额趋势</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  {loading ? <Skeleton className="h-[300px] w-full" /> : <OrderTrendChart />}
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>支付方式分布</CardTitle>
                  <CardDescription>各支付方式的订单占比</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? <Skeleton className="h-[300px] w-full" /> : <PaymentMethodChart />}
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>最近交易</CardTitle>
                <CardDescription>最近处理的订单和退款</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <RecentTransactions />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>详细分析</CardTitle>
                <CardDescription>深入了解您的业务数据</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p>查看更多详细分析，请访问分析页面</p>
                  <a href="/dashboard/analytics" className="text-blue-500 hover:underline mt-2 inline-block">
                    前往分析页面 →
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>报表中心</CardTitle>
                <CardDescription>生成和下载业务报表</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p>生成详细报表，请访问报表页面</p>
                  <a href="/dashboard/reports" className="text-blue-500 hover:underline mt-2 inline-block">
                    前往报表页面 →
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
