import { CreditCard, DollarSign, Package, RefreshCcw } from "lucide-react"

import { StatCard } from "@/components/dashboard/stat-card"
import { OrderTrendChart } from "@/components/dashboard/order-trend-chart"
import { PaymentMethodChart } from "@/components/dashboard/payment-method-chart"
import { OrderStatusChart } from "@/components/dashboard/order-status-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"

export default function DashboardPage() {
  return (
    <div className="space-y-6 w-full">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="今日订单总数"
          value="128"
          description="今日新增订单数量"
          icon={Package}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="今日交易金额"
          value="¥12,456"
          description="今日成功交易总额"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="待支付订单"
          value="23"
          description="等待支付的订单数量"
          icon={CreditCard}
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="待处理退款"
          value="7"
          description="等待处理的退款申请"
          icon={RefreshCcw}
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <OrderTrendChart />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <PaymentMethodChart />
        <OrderStatusChart />
      </div>

      <RecentTransactions />
    </div>
  )
}
