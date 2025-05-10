"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

const emailFormSchema = z.object({
  enabled: z.boolean(),
  smtpHost: z.string().min(1, {
    message: "SMTP主机不能为空",
  }),
  smtpPort: z.coerce.number().int().positive({
    message: "请输入有效的端口号",
  }),
  smtpUsername: z.string().min(1, {
    message: "SMTP用户名不能为空",
  }),
  smtpPassword: z.string().min(1, {
    message: "SMTP密码不能为空",
  }),
  fromEmail: z.string().email({
    message: "请输入有效的发件人邮箱",
  }),
  fromName: z.string().min(1, {
    message: "发件人名称不能为空",
  }),
  enableSsl: z.boolean(),
  orderCreatedTemplate: z.string().min(1, {
    message: "模板内容不能为空",
  }),
  paymentSuccessTemplate: z.string().min(1, {
    message: "模板内容不能为空",
  }),
  refundSuccessTemplate: z.string().min(1, {
    message: "模板内容不能为空",
  }),
})

const smsFormSchema = z.object({
  enabled: z.boolean(),
  provider: z.string().min(1, {
    message: "请选择服务提供商",
  }),
  apiKey: z.string().min(1, {
    message: "API密钥不能为空",
  }),
  apiSecret: z.string().min(1, {
    message: "API密钥不能为空",
  }),
  signName: z.string().min(1, {
    message: "短信签名不能为空",
  }),
  orderCreatedTemplateCode: z.string().min(1, {
    message: "模板代码不能为空",
  }),
  paymentSuccessTemplateCode: z.string().min(1, {
    message: "模板代码不能为空",
  }),
  refundSuccessTemplateCode: z.string().min(1, {
    message: "模板代码不能为空",
  }),
})

export function NotificationSettings() {
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false)
  const [isSubmittingSms, setIsSubmittingSms] = useState(false)

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      enabled: true,
      smtpHost: "smtp.example.com",
      smtpPort: 465,
      smtpUsername: "noreply@example.com",
      smtpPassword: "password123",
      fromEmail: "noreply@example.com",
      fromName: "支付系统",
      enableSsl: true,
      orderCreatedTemplate: "尊敬的{customer_name}，您的订单 {order_number} 已创建，金额为 {amount} 元。",
      paymentSuccessTemplate: "尊敬的{customer_name}，您的订单 {order_number} 已支付成功，金额为 {amount} 元。",
      refundSuccessTemplate: "尊敬的{customer_name}，您的订单 {order_number} 已退款成功，金额为 {amount} 元。",
    },
  })

  const smsForm = useForm<z.infer<typeof smsFormSchema>>({
    resolver: zodResolver(smsFormSchema),
    defaultValues: {
      enabled: true,
      provider: "aliyun",
      apiKey: "LTAI4G1234567890ABCDE",
      apiSecret: "abcdefghijklmnopqrstuvwxyz123456",
      signName: "支付系统",
      orderCreatedTemplateCode: "SMS_123456789",
      paymentSuccessTemplateCode: "SMS_987654321",
      refundSuccessTemplateCode: "SMS_123987456",
    },
  })

  async function onSubmitEmail(values: z.infer<typeof emailFormSchema>) {
    setIsSubmittingEmail(true)

    try {
      // 这里应该调用API保存设置
      console.log("保存邮件通知设置:", values)

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "设置已保存",
        description: "邮件通知配置已成功更新",
      })
    } catch (error) {
      console.error("保存设置失败:", error)
      toast({
        title: "保存失败",
        description: "无法保存邮件通知设置，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingEmail(false)
    }
  }

  async function onSubmitSms(values: z.infer<typeof smsFormSchema>) {
    setIsSubmittingSms(true)

    try {
      // 这里应该调用API保存设置
      console.log("保存短信通知设置:", values)

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "设置已保存",
        description: "短信通知配置已成功更新",
      })
    } catch (error) {
      console.error("保存设置失败:", error)
      toast({
        title: "保存失败",
        description: "无法保存短信通知设置，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingSms(false)
    }
  }

  return (
    <Tabs defaultValue="email" className="space-y-4 w-full">
      <TabsList>
        <TabsTrigger value="email">邮件通知</TabsTrigger>
        <TabsTrigger value="sms">短信通知</TabsTrigger>
      </TabsList>
      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>邮件通知设置</CardTitle>
            <CardDescription>配置系统邮件通知参数</CardDescription>
          </CardHeader>
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onSubmitEmail)}>
              <CardContent className="space-y-6">
                <FormField
                  control={emailForm.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">启用邮件通知</FormLabel>
                        <FormDescription>启用后，系统将发送邮件通知</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={emailForm.control}
                    name="smtpHost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP主机</FormLabel>
                        <FormControl>
                          <Input placeholder="输入SMTP主机" {...field} />
                        </FormControl>
                        <FormDescription>邮件服务器主机地址</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name="smtpPort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP端口</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="输入SMTP端口" {...field} />
                        </FormControl>
                        <FormDescription>邮件服务器端口，通常为25、465或587</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={emailForm.control}
                    name="smtpUsername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP用户名</FormLabel>
                        <FormControl>
                          <Input placeholder="输入SMTP用户名" {...field} />
                        </FormControl>
                        <FormDescription>邮件服务器登录用户名</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name="smtpPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP密码</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="输入SMTP密码" {...field} />
                        </FormControl>
                        <FormDescription>邮件服务器登录密码</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={emailForm.control}
                    name="fromEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>发件人邮箱</FormLabel>
                        <FormControl>
                          <Input placeholder="输入发件人邮箱" {...field} />
                        </FormControl>
                        <FormDescription>邮件发送者的邮箱地址</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name="fromName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>发件人名称</FormLabel>
                        <FormControl>
                          <Input placeholder="输入发件人名称" {...field} />
                        </FormControl>
                        <FormDescription>邮件发送者的显示名称</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={emailForm.control}
                  name="enableSsl"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">启用SSL/TLS</FormLabel>
                        <FormDescription>启用SSL/TLS加密连接</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={emailForm.control}
                  name="orderCreatedTemplate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>订单创建通知模板</FormLabel>
                      <FormControl>
                        <Textarea placeholder="输入订单创建通知模板" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormDescription>
                        可用变量: {"{customer_name}"}, {"{order_number}"}, {"{amount}"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={emailForm.control}
                  name="paymentSuccessTemplate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>支付成功通知模板</FormLabel>
                      <FormControl>
                        <Textarea placeholder="输入支付成功通知模板" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormDescription>
                        可用变量: {"{customer_name}"}, {"{order_number}"}, {"{amount}"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={emailForm.control}
                  name="refundSuccessTemplate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>退款成功通知模板</FormLabel>
                      <FormControl>
                        <Textarea placeholder="输入退款成功通知模板" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormDescription>
                        可用变量: {"{customer_name}"}, {"{order_number}"}, {"{amount}"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isSubmittingEmail}>
                  {isSubmittingEmail ? "保存中..." : "保存设置"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>
      <TabsContent value="sms">
        <Card>
          <CardHeader>
            <CardTitle>短信通知设置</CardTitle>
            <CardDescription>配置系统短信通知参数</CardDescription>
          </CardHeader>
          <Form {...smsForm}>
            <form onSubmit={smsForm.handleSubmit(onSubmitSms)}>
              <CardContent className="space-y-6">
                <FormField
                  control={smsForm.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">启用短信通知</FormLabel>
                        <FormDescription>启用后，系统将发送短信通知</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={smsForm.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>服务提供商</FormLabel>
                      <FormControl>
                        <Input placeholder="输入服务提供商" {...field} />
                      </FormControl>
                      <FormDescription>短信服务提供商，如阿里云、腾讯云等</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={smsForm.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API密钥</FormLabel>
                        <FormControl>
                          <Input placeholder="输入API密钥" {...field} />
                        </FormControl>
                        <FormDescription>短信服务API密钥</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={smsForm.control}
                    name="apiSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API密钥</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="输入API密钥" {...field} />
                        </FormControl>
                        <FormDescription>短信服务API密钥</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={smsForm.control}
                  name="signName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>短信签名</FormLabel>
                      <FormControl>
                        <Input placeholder="输入短信签名" {...field} />
                      </FormControl>
                      <FormDescription>短信签名，需要在服务提供商平台备案</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={smsForm.control}
                  name="orderCreatedTemplateCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>订单创建通知模板代码</FormLabel>
                      <FormControl>
                        <Input placeholder="输入模板代码" {...field} />
                      </FormControl>
                      <FormDescription>订单创建通知短信模板代码</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={smsForm.control}
                  name="paymentSuccessTemplateCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>支付成功通知模板代码</FormLabel>
                      <FormControl>
                        <Input placeholder="输入模板代码" {...field} />
                      </FormControl>
                      <FormDescription>支付成功通知短信模板代码</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={smsForm.control}
                  name="refundSuccessTemplateCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>退款成功通知模板代码</FormLabel>
                      <FormControl>
                        <Input placeholder="输入模板代码" {...field} />
                      </FormControl>
                      <FormDescription>退款成功通知短信模板代码</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isSubmittingSms}>
                  {isSubmittingSms ? "保存中..." : "保存设置"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
