"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { PaymentType } from "./order-list"; // 导入类型定义

export function CreateOrder() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    title: "",
    description: "",
    amount: "",
    payment_type: "wechat" as PaymentType,
  });

  // 处理输入变化
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setOrderData({
      ...orderData,
      [name]: value,
    });
  };

  // 处理支付方式选择
  const handlePaymentTypeChange = (value: string) => {
    setOrderData({
      ...orderData,
      payment_type: value as PaymentType,
    });
  };

  // 创建订单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 输入验证
    if (!orderData.title.trim()) {
      toast({
        title: "错误",
        description: "请输入商品名称",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(orderData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "错误",
        description: "请输入有效的金额",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // 获取当前用户ID（实际应用中从认证上下文获取）
      const userId = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")!).id
        : "current-user-id";

      // 准备请求数据
      const requestData = {
        title: orderData.title,
        description: orderData.description,
        amount: parseFloat(orderData.amount),
        payment_type: orderData.payment_type,
        user_id: userId,
      };

      // 发送创建订单请求
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("创建订单失败");
      }

      const data = await response.json();

      toast({
        title: "成功",
        description: "订单创建成功",
      });

      // 跳转到支付页面或订单详情页
      router.push(`/dashboard/orders/${data.order_id}`);
    } catch (error) {
      console.error("创建订单错误:", error);
      toast({
        title: "错误",
        description: "创建订单失败，请稍后再试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold">创建新订单</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>订单信息</CardTitle>
            <CardDescription>请填写订单详情以创建新订单</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">商品名称</Label>
              <Input
                id="title"
                name="title"
                placeholder="请输入商品或服务名称"
                value={orderData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">商品描述</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="请输入商品或服务的详细描述（可选）"
                value={orderData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">金额（元）</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="请输入订单金额"
                min="0.01"
                step="0.01"
                value={orderData.amount}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_type">支付方式</Label>
              <Select
                value={orderData.payment_type}
                onValueChange={handlePaymentTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择支付方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wechat">微信支付</SelectItem>
                  <SelectItem value="alipay">支付宝</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "创建中..." : "创建订单"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
