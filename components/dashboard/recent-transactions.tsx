"use client"

import { useState } from "react"
import { ArrowUpDown, CheckCircle2, Clock, MoreHorizontal, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// 模拟数据
const transactions = [
  {
    id: "TX123456",
    orderId: "ORD-001",
    amount: "¥299.00",
    status: "success",
    method: "wechat",
    date: "2023-05-01 14:30",
  },
  {
    id: "TX123457",
    orderId: "ORD-002",
    amount: "¥599.00",
    status: "pending",
    method: "alipay",
    date: "2023-05-01 15:45",
  },
  {
    id: "TX123458",
    orderId: "ORD-003",
    amount: "¥199.00",
    status: "success",
    method: "wechat",
    date: "2023-05-01 16:20",
  },
  {
    id: "TX123459",
    orderId: "ORD-004",
    amount: "¥899.00",
    status: "failed",
    method: "alipay",
    date: "2023-05-01 17:10",
  },
  {
    id: "TX123460",
    orderId: "ORD-005",
    amount: "¥399.00",
    status: "success",
    method: "wechat",
    date: "2023-05-01 18:05",
  },
]

export function RecentTransactions() {
  const [sorting, setSorting] = useState<"asc" | "desc">("desc")

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return sorting === "asc" ? dateA - dateB : dateB - dateA
  })

  const toggleSorting = () => {
    setSorting(sorting === "asc" ? "desc" : "asc")
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>最近交易</CardTitle>
            <CardDescription>最近处理的交易记录</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={toggleSorting}>
            日期
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>交易ID</TableHead>
              <TableHead>订单ID</TableHead>
              <TableHead>金额</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>支付方式</TableHead>
              <TableHead>日期</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{transaction.orderId}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>
                  <StatusBadge status={transaction.status} />
                </TableCell>
                <TableCell>
                  <PaymentMethodBadge method={transaction.method} />
                </TableCell>
                <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">操作</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>查看详情</DropdownMenuItem>
                      <DropdownMenuItem>查看订单</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === "success") {
    return (
      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
        <CheckCircle2 className="mr-1 h-3 w-3" /> 成功
      </Badge>
    )
  }
  if (status === "pending") {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
        <Clock className="mr-1 h-3 w-3" /> 处理中
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
      <XCircle className="mr-1 h-3 w-3" /> 失败
    </Badge>
  )
}

function PaymentMethodBadge({ method }: { method: string }) {
  if (method === "wechat") {
    return (
      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
        微信支付
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
      支付宝
    </Badge>
  )
}
