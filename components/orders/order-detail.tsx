"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { PaymentMethodBadge } from "@/components/orders/payment-method-badge";
import { toast } from "@/components/ui/use-toast";
import { Order } from "./order-list"; // 导入类型定义

interface OrderDetailProps {
  orderId: string;
}

export function OrderDetail({ orderId }: OrderDetailProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 格式化状态
  const mapOrderStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      created: "CREATED",
      pending: "PENDING",
      paid: "PAID",
      cancelled: "CANCELLED",
      refund_applying: "REFUND_APPLYING",
      refund_failed: "REFUND_FAILED",
      refunded_partial: "REFUNDED_PARTIAL",
      refunded: "REFUNDED",
      failed: "FAILED",
    };
    return statusMap[status] || status.toUpperCase();
  };

  // 格式化日期时间
  const formatDateTime = (dateTimeStr?: string): string => {
    if (!dateTimeStr) return "未设置";
    const date = new Date(dateTimeStr);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // 加载订单详情
  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("获取订单详情失败");
      }

      const data = await response.json();
      setOrder(data);
      setError(null);
    } catch (err) {
      setError("获取订单详情失败");
      toast({
        title: "错误",
        description: "无法加载订单信息，请稍后再试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 申请退款
  const applyRefund = async () => {
    router.push(`/dashboard/refunds/create?orderId=${orderId}`);
  };

  // 取消订单
  const cancelOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!response.ok) {
        throw new Error("取消订单失败");
      }

      toast({
        title: "成功",
        description: "订单已成功取消",
      });

      // 重新加载订单详情
      loadOrderDetail();
    } catch (err) {
      toast({
        title: "错误",
        description: "取消订单失败，请稍后再试",
        variant: "destructive",
      });
    }
  };

  // 组件加载时获取订单详情
  useEffect(() => {
    if (orderId) {
      loadOrderDetail();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600">
        {error || "订单不存在"}
        <Button
          variant="outline"
          className="ml-4"
          onClick={() => router.back()}
        >
          返回
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="mr-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">订单详情</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>订单 #{order.order_id}</CardTitle>
              <CardDescription>
                创建于 {formatDateTime(order.created_at)}
              </CardDescription>
            </div>
            <OrderStatusBadge status={mapOrderStatus(order.status)} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">商品信息</h3>
                <p className="mt-1 text-lg font-medium">{order.title}</p>
                {order.description && (
                  <p className="text-muted-foreground">{order.description}</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">金额</h3>
                <p className="mt-1 text-lg font-medium">
                  ¥{order.amount.toFixed(2)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">支付方式</h3>
                <div className="mt-1">
                  {order.payment_type ? (
                    <PaymentMethodBadge method={order.payment_type} />
                  ) : (
                    <span className="text-muted-foreground">
                      未选择支付方式
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">订单状态</h3>
                <div className="mt-1 flex items-center">
                  <OrderStatusBadge status={mapOrderStatus(order.status)} />
                  <span className="ml-2 text-sm text-muted-foreground">
                    {order.status === "paid" &&
                      `支付于 ${formatDateTime(order.paid_at)}`}
                    {order.status === "refunded" &&
                      `退款于 ${formatDateTime(order.refund_time)}`}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">订单时间</h3>
                <div className="mt-1 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">创建时间：</span>
                    <span>{formatDateTime(order.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">更新时间：</span>
                    <span>{formatDateTime(order.updated_at)}</span>
                  </div>
                  {order.paid_at && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">支付时间：</span>
                      <span>{formatDateTime(order.paid_at)}</span>
                    </div>
                  )}
                  {order.refund_time && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">退款时间：</span>
                      <span>{formatDateTime(order.refund_time)}</span>
                    </div>
                  )}
                </div>
              </div>

              {order.transaction_id && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">交易ID</h3>
                  <p className="mt-1 font-mono text-sm">
                    {order.transaction_id}
                  </p>
                </div>
              )}
            </div>
          </div>

          {order.refund_id && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                退款信息
              </h3>
              <div className="bg-gray-50 p-4 rounded-md space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">退款ID：</span>
                  <span className="font-mono">{order.refund_id}</span>
                </div>
                {order.refund_amount && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">退款金额：</span>
                    <span>¥{order.refund_amount.toFixed(2)}</span>
                  </div>
                )}
                {order.refund_reason && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">退款原因：</span>
                    <span>{order.refund_reason}</span>
                  </div>
                )}
                {order.refund_status && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">退款状态：</span>
                    <span>{order.refund_status}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            {order.status === "created" || order.status === "pending" ? (
              <Button variant="destructive" onClick={cancelOrder}>
                取消订单
              </Button>
            ) : null}

            {order.status === "paid" && (
              <Button onClick={applyRefund}>申请退款</Button>
            )}

            {(order.status === "created" || order.status === "pending") && (
              <Button
                onClick={() =>
                  (window.location.href = `/api/payment/pay?orderId=${order.order_id}`)
                }
              >
                去支付
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
