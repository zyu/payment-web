"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, Download, RefreshCw } from "lucide-react"
import { statisticsApi, type OrderOverview, type TrendData } from "@/app/services/statistics-service"
import { useToast } from "@/hooks/use-toast"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("last_30_days")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [overview, setOverview] = useState<OrderOverview | null>(null)
  const [trends, setTrends] = useState<TrendData[]>([])
  const { toast } = useToast()

  const fetchAnalyticsData = async () => {
    setIsLoading(true)
    try {
      const [overviewData, trendsData] = await Promise.all([
        statisticsApi.getOrderOverview({ time_range: timeRange as any }),
        statisticsApi.getOrderTrends({ time_range: timeRange as any }),
      ])

      setOverview(overviewData)
      setTrends(trendsData)
    } catch (error) {
      console.error("获取分析数据失败", error)
      toast({
        title: "错误",
        description: "获取分析数据失败",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchAnalyticsData().finally(() => {
      setTimeout(() => setIsRefreshing(false), 500)
    })
  }

  const handleExport = async () => {
    try {
      const result = await statisticsApi.exportStatistics({
        time_range: timeRange as any,
        report_type: "order_overview",
        format: "excel",
      })

      // 创建下载链接
      const link = document.createElement("a")
      link.href = result.download_url
      link.download = `订单分析报告_${timeRange}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "成功",
        description: "报告导出成功",
      })
    } catch (error) {
      toast({
        title: "错误",
        description: "导出失败",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">数据分析</h1>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">今天</SelectItem>
              <SelectItem value="yesterday">昨天</SelectItem>
              <SelectItem value="last_7_days">过去7天</SelectItem>
              <SelectItem value="last_30_days">过去30天</SelectItem>
              <SelectItem value="this_month">本月</SelectItem>
              <SelectItem value="last_month">上月</SelectItem>
              <SelectItem value="this_year">今年</SelectItem>
              <SelectItem value="last_year">去年</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
        </div>
      </div>

      {/* 概览卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总订单数</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
              ) : (
                overview?.total_orders || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">订单总数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总收入</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
              ) : (
                `¥${overview?.total_revenue?.toLocaleString() || 0}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">总收入金额</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均订单价值</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
              ) : (
                `¥${overview?.average_order_value?.toFixed(2) || 0}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">平均每单金额</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">退款率</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
              ) : (
                `${(overview?.refund_statistics?.refund_rate || 0).toFixed(2)}%`
              )}
            </div>
            <p className="text-xs text-muted-foreground">退款 {overview?.refund_statistics?.total_refunds || 0} 笔</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="trends">趋势</TabsTrigger>
          <TabsTrigger value="products">商品</TabsTrigger>
          <TabsTrigger value="payments">支付</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>订单状态分布</CardTitle>
                <CardDescription>各状态订单的数量分布</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
                ) : (
                  <div className="space-y-2">
                    {overview?.order_status_distribution &&
                      Object.entries(overview.order_status_distribution).map(([status, count]) => (
                        <div key={status} className="flex justify-between">
                          <span className="capitalize">{status}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>支付方式分布</CardTitle>
                <CardDescription>各支付方式的使用情况</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
                ) : (
                  <div className="space-y-2">
                    {overview?.payment_method_distribution &&
                      Object.entries(overview.payment_method_distribution).map(([method, count]) => (
                        <div key={method} className="flex justify-between">
                          <span className="capitalize">{method}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>订单趋势</CardTitle>
              <CardDescription>订单数量和收入的时间趋势</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
              ) : (
                <div className="h-80">
                  {trends.length > 0 ? (
                    <div className="h-full">
                      {/* 这里可以添加图表组件 */}
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">趋势数据已加载，共 {trends.length} 个数据点</p>
                        <p className="text-sm text-muted-foreground">
                          最新数据: {trends[trends.length - 1].date} - {trends[trends.length - 1].order_count} 订单, ¥
                          {trends[trends.length - 1].revenue.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">暂无趋势数据</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>商品销售统计</CardTitle>
              <CardDescription>热销商品和销售数据</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {isLoading ? (
                  <div className="h-full w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Button onClick={() => statisticsApi.getProductStatistics({ time_range: timeRange as any })}>
                      加载商品统计
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>支付分析</CardTitle>
              <CardDescription>支付方式详细分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {isLoading ? (
                  <div className="h-full w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Button onClick={() => statisticsApi.getPaymentMethodAnalysis({ time_range: timeRange as any })}>
                      加载支付分析
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
