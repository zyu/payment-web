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
import type { Payment, PaymentStatus } from "@/lib/types/payment"

// 模拟数据
const payments: Payment[] = [
  {
    id: "1",
    orderId: "1",
    orderNumber: "ORD-001",
    transactionId: "WX123456789",
    amount: 299,
    method: "wechat",
    status: "SUCCESS",
    createdAt: "2023-05-01 14:30:00",
    updatedAt: "2023-05-01 14:35:00",
    paidAt: "2023-05-01 14:35:00",
  },
  {
    id: "2",
    orderId: "2",
    orderNumber: "ORD-002",
    amount: 599,
    method: "alipay",
    status: "PENDING",
    createdAt: "2023-05-01 15:45:00",
    updatedAt: "2023-05-01 15:45:00",
    qrCodeUrl: "https://example.com/qrcode.png",
  },
  {
    id: "3",
    orderId: "3",
    orderNumber: "ORD-003",
    transactionId: "WX987654321",
    amount: 199,
    method: "wechat",
    status: "SUCCESS",
    createdAt: "2023-05-01 16:20:00",
    updatedAt: "2023-05-01 16:25:00",
    paidAt: "2023-05-01 16:25:00",
  },
  {
    id: "4",
    orderId: "4",
    orderNumber: "ORD-004",
    amount: 899,
    method: "alipay",
    status: "FAILED",
    createdAt: "2023-05-01 17:10:00",
    updatedAt: "2023-05-01 17:15:00",
    errorMessage: "支付超时",
  },
  {
    id: "5",
    orderId: "5",
    orderNumber: "ORD-005",
    transactionId: "WX123123123",
    amount: 399,
    method: "wechat",
    status: "SUCCESS",
    createdAt: "2023-05-01 18:05:00",
    updatedAt: "2023-05-01 18:10:00",
    paidAt: "2023-05-01 18:10:00",
  },
]

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  switch (status) {
    case "SUCCESS":
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          成功
        </span>
      )
    case "PENDING":
      return (
        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
          处理中
        </span>
      )
    case "FAILED":
      return (
        <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
          失败
        </span>
      )
    case "EXPIRED":
      return (
        <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20">
          已过期
        </span>
      )
    default:
      return null
  }
}

export function PaymentList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">("ALL")
  const [sorting, setSorting] = useState<{ column: keyof Payment; direction: "asc" | "desc" }>({
    column: "createdAt",
    direction: "desc",
  })

  // 过滤支付记录
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.transactionId && payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "ALL" || payment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // 排序支付记录
  const sortedPayments = [...filteredPayments].sort((a, b) => {
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
  const handleSort = (column: keyof Payment) => {
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
            placeholder="搜索订单号或交易ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            prefix={<Search className="h-4 w-4 text-muted-foreground" />}
          />
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PaymentStatus | "ALL")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="状态筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部状态</SelectItem>
              <SelectItem value="PENDING">处理中</SelectItem>
              <SelectItem value="SUCCESS">成功</SelectItem>
              <SelectItem value="FAILED">失败</SelectItem>
              <SelectItem value="EXPIRED">已过期</SelectItem>
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
              <TableHead>交易ID</TableHead>
              <TableHead>
                <div className="flex items-center space-x-1" onClick={() => handleSort("amount")}>
                  <span>金额</span>
                  <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                </div>
              </TableHead>
              <TableHead>状态</TableHead>
              <TableHead>支付方式</TableHead>
              <TableHead>
                <div className="flex items-center space-x-1" onClick={() => handleSort("createdAt")}>
                  <span>创建时间</span>
                  <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                </div>
              </TableHead>
              <TableHead>支付时间</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  没有找到符合条件的支付记录
                </TableCell>
              </TableRow>
            ) : (
              sortedPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.orderNumber}</TableCell>
                  <TableCell>{payment.transactionId || "-"}</TableCell>
                  <TableCell>¥{payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={payment.status} />
                  </TableCell>
                  <TableCell>
                    <PaymentMethodBadge method={payment.method} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{payment.createdAt}</TableCell>
                  <TableCell className="text-muted-foreground">{payment.paidAt || "-"}</TableCell>
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
                          <Link href={`/dashboard/payments/${payment.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> 查看详情
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/orders/${payment.orderId}`}>
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
