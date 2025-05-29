"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { statisticsApi, type OrderOverview } from "@/app/services/statistics-service"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [overview, setOverview] = useState<OrderOverview | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        // 获取最近30天的数据概览
        const data = await statisticsApi.getOrderOverview({ time_range: "last_30_days" })
        setOverview(data)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        toast({
          title: "错误",
          description: "获取仪表板数据失败",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">仪表板</h1>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="analytics">分析</TabsTrigger>
          <TabsTrigger value="reports">报表</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总订单数</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-28" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{overview?.total_orders?.toLocaleString() || 0}</div>
                    <p className="text-xs text-muted-foreground">过去30天</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总收入</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-28" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      ¥
                      {overview?.total_revenue?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) || "0.00"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      平均订单: ¥{overview?.average_order_value?.toFixed(2) || "0.00"}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">退款</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-28" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{overview?.refund_statistics?.total_refunds || 0} 笔</div>
                    <p className="text-xs text-muted-foreground">
                      退款金额: ¥{overview?.refund_statistics?.total_refund_amount?.toFixed(2) || "0.00"}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">退款率</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-28" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {(overview?.refund_statistics?.refund_rate * 100)?.toFixed(2) || "0.00"}%
                    </div>
                    <p className="text-xs text-muted-foreground">退款率</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>订单状态分布</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {isLoading ? (
                  <div className="w-full aspect-[2/1]">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : overview?.order_status_distribution ? (
                  <div className="space-y-2">
                    {Object.entries(overview.order_status_distribution).map(([status, count]) => (
                      <div key={status} className="flex justify-between">
                        <span className="capitalize">{status}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center pt-8 pb-10">
                    <p className="text-muted-foreground">暂无订单状态数据</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>支付方式分布</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="w-full aspect-square">
                    <Skeleton className="h-full w-full rounded-full" />
                  </div>
                ) : overview?.payment_method_distribution ? (
                  <div className="space-y-2">
                    {Object.entries(overview.payment_method_distribution).map(([method, count]) => (
                      <div key={method} className="flex justify-between">
                        <span className="capitalize">{method}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center pt-8 pb-10">
                    <p className="text-muted-foreground">暂无支付方式数据</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
              <CardDescription>常用功能快速入口</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <CardContent className="p-4 text-center">
                    <h3 className="font-medium">查看订单</h3>
                    <p className="text-sm text-muted-foreground">管理所有订单</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <CardContent className="p-4 text-center">
                    <h3 className="font-medium">处理退款</h3>
                    <p className="text-sm text-muted-foreground">审核退款申请</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <CardContent className="p-4 text-center">
                    <h3 className="font-medium">数据分析</h3>
                    <p className="text-sm text-muted-foreground">查看详细报表</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>详细分析</CardTitle>
              <CardDescription>查看详细的销售和支付分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  <a href="/dashboard/analytics" className="text-blue-600 hover:underline">
                    前往分析页面查看详细数据 →
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>报表生成</CardTitle>
              <CardDescription>生成和下载各类报表</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">报表功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
