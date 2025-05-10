"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpDown, Eye, MoreHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PaymentMethodBadge } from "@/components/orders/payment-method-badge"
import type { Refund, RefundStatus } from "@/lib/types/refund"

// 模拟数据
const refunds: Refund[] = [
  {
    id: "1",
    orderId: "1",
    orderNumber: "ORD-001",
    paymentId: "1",
    refundId: "RF123456789",
    amount: 299,
    originalAmount: 299,
    reason: "客户不满意",
    method: "wechat",
    status: "SUCCESS",
    createdAt: "2023-05-02 10:30:00",
    updatedAt: "2023-05-02 10:35:00",
    completedAt: "2023-05-02 10:35:00",
  },
  {
    id: "2",
    orderId: "2",
    orderNumber: "ORD-002",
    paymentId: "2",
    amount: 300,
    originalAmount: 599,
    reason: "部分退款",
    method: "alipay",
    status: "PROCESSING",
    createdAt: "2023-05-02 11:45:00",
    updatedAt: "2023-05-02 11:45:00",
  },
  {
    id: "3",
    orderId: "3",
    orderNumber: "ORD-003",
    paymentId: "3",
    refundId: "RF987654321",
    amount: 199,
    originalAmount: 199,
    reason: "商品缺货",
    method: "wechat",
    status: "SUCCESS",
    createdAt: "2023-05-02 12:20:00",
    updatedAt: "2023-05-02 12:25:00",
    completedAt: "2023-05-02 12:25:00",
  },
  {
    id: "4",
    orderId: "4",
    orderNumber: "ORD-004",
    paymentId: "4",
    amount: 899,
    originalAmount: 899,
    reason: "客户取消订单",
    method: "alipay",
    status: "FAILED",
    createdAt: "2023-05-02 13:10:00",
    updatedAt: "2023-05-02 13:15:00",
    errorMessage: "退款账户异常",
  },
  {
    id: "5",
    orderId: "5",
    orderNumber: "ORD-005",
    paymentId: "5",
    amount: 200,
    originalAmount: 399,
    reason: "部分退款",
    method: "wechat",
    status: "APPLYING",
    createdAt: "2023-05-02 14:05:00",
    updatedAt: "2023-05-02 14:05:00",
  },
]

function RefundStatusBadge({ status }: { status: RefundStatus }) {
  switch (status) {
    case "SUCCESS":
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          成功
        </span>
      )
    case "PROCESSING":
      return (
        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
          处理中
        </span>
      )
    case "APPLYING":
      return (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
          申请中
        </span>
      )
    case "FAILED":
      return (
        <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
          失败
        </span>
      )
    default:
      return null
  }
}

export function RefundList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<RefundStatus | "ALL">("ALL")
  const [sorting, setSorting] = useState<{ column: keyof Refund; direction: "asc" | "desc" }>({
    column: "createdAt",
    direction: "desc",
  })

  // 过滤退款记录
  const filteredRefunds = refunds.filter((refund) => {
    const matchesSearch =
      refund.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (refund.refundId && refund.refundId.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "ALL" || refund.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // 排序退款记录
  const sortedRefunds = [...filteredRefunds].sort((a, b) => {
    const aValue = a[sorting.column]
    const bValue = b[sorting.column]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sorting.direction === "asc" ? aValue - bValue : bValue - aValue
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sorting.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  // 排序处理函数
  const handleSort = (column: keyof Refund) => {
    setSorting((prev) => ({
      column,
      direction: prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="搜索订单号或退款ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            prefix={<Search className="h-4 w-4 text-muted-foreground" />}
          />
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as RefundStatus | "ALL")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="状态筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部状态</SelectItem>
              <SelectItem value="APPLYING">申请中</SelectItem>
              <SelectItem value="PROCESSING">处理中</SelectItem>
              <SelectItem value="SUCCESS">成功</SelectItem>
              <SelectItem value="FAILED">失败</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">
                <div className="flex items-center space-x-1" onClick={() => handleSort("orderNumber")}>
                  <span>订单号</span>
                  <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                </div>
              </TableHead>
              <TableHead>退款ID</TableHead>
              <TableHead>
                <div className="flex items-center space-x-1" onClick={() => handleSort("amount")}>
                  <span>退款金额</span>
                  <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                </div>
              </TableHead>
              <TableHead>原始金额</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>支付方式</TableHead>
              <TableHead>
                <div className="flex items-center space-x-1" onClick={() => handleSort("createdAt")}>
                  <span>申请时间</span>
                  <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                </div>
              </TableHead>
              <TableHead>完成时间</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRefunds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  没有找到符合条件的退款记录
                </TableCell>
              </TableRow>
            ) : (
              sortedRefunds.map((refund) => (
                <TableRow key={refund.id}>
                  <TableCell className="font-medium">{refund.orderNumber}</TableCell>
                  <TableCell>{refund.refundId || "-"}</TableCell>
                  <TableCell>¥{refund.amount.toFixed(2)}</TableCell>
                  <TableCell>¥{refund.originalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <RefundStatusBadge status={refund.status} />
                  </TableCell>
                  <TableCell>
                    <PaymentMethodBadge method={refund.method} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{refund.createdAt}</TableCell>
                  <TableCell className="text-muted-foreground">{refund.completedAt || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">操作</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/refunds/${refund.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> 查看详情
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/orders/${refund.orderId}`}>
                            <Eye className="mr-2 h-4 w-4" /> 查看订单
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
