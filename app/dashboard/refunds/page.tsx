"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { refundApi, type Refund } from "@/app/services/api-service"
import { useToast } from "@/hooks/use-toast"

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const limit = 10
  const { toast } = useToast()

  const fetchRefunds = async () => {
    try {
      setIsLoading(true)
      const data = await refundApi.getRefunds({
        status: statusFilter || undefined,
        search: searchTerm || undefined,
        page: currentPage,
        limit,
      })

      setRefunds(data.refunds)
      setTotalPages(data.pagination.total_pages || 1)
    } catch (error) {
      console.error("获取退款失败", error)
      toast({
        title: "错误",
        description: "获取退款失败",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRefunds()
  }, [currentPage, statusFilter])

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchRefunds()
      } else {
        setCurrentPage(1)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const getStatusClass = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "处理中"
      case "approved":
        return "已批准"
      case "rejected":
        return "已拒绝"
      case "completed":
        return "已完成"
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">退款管理</h1>
        <Link href="/dashboard/refunds/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            申请退款
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">所有退款</TabsTrigger>
          <TabsTrigger value="approved">已批准</TabsTrigger>
          <TabsTrigger value="pending">处理中</TabsTrigger>
          <TabsTrigger value="rejected">已拒绝</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>退款列表</CardTitle>
              <CardDescription>管理和查看所有退款申请</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4 gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="search"
                    placeholder="搜索退款..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="退款状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="pending">处理中</SelectItem>
                    <SelectItem value="approved">已批准</SelectItem>
                    <SelectItem value="rejected">已拒绝</SelectItem>
                    <SelectItem value="completed">已完成</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>退款ID</TableHead>
                          <TableHead>订单ID</TableHead>
                          <TableHead>金额</TableHead>
                          <TableHead>原因</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>申请时间</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {refunds && refunds.length > 0 ? (
                          refunds.map((refund) => (
                            <TableRow key={refund.id}>
                              <TableCell className="font-medium">{refund.id}</TableCell>
                              <TableCell>{refund.order_id}</TableCell>
                              <TableCell>¥{refund.amount.toFixed(2)}</TableCell>
                              <TableCell>{refund.reason}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(refund.status)}`}
                                >
                                  {getStatusText(refund.status)}
                                </span>
                              </TableCell>
                              <TableCell>{new Date(refund.created_at).toLocaleString("zh-CN")}</TableCell>
                              <TableCell className="text-right">
                                <Link href={`/dashboard/refunds/${refund.id}`}>
                                  <Button variant="outline" size="sm">
                                    查看
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                              没有找到退款记录
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* 分页 */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500">
                      第 {currentPage} 页，共 {totalPages} 页
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        上一页
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        下一页
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 其他标签页内容 */}
        {["approved", "pending", "rejected"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{getStatusText(status)}退款</CardTitle>
                <CardDescription>查看所有{getStatusText(status)}的退款申请</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => {
                    setStatusFilter(status)
                    // 切换到"所有退款"标签页以显示过滤结果
                    document.querySelector('[value="all"]')?.click()
                  }}
                >
                  查看{getStatusText(status)}退款
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
