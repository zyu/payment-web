"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

const wechatFormSchema = z.object({
  enabled: z.boolean(),
  appId: z.string().min(1, {
    message: "AppID不能为空",
  }),
  mchId: z.string().min(1, {
    message: "商户号不能为空",
  }),
  apiKey: z.string().min(1, {
    message: "API密钥不能为空",
  }),
  certPath: z.string().optional(),
  notifyUrl: z.string().url({
    message: "请输入有效的回调URL",
  }),
  sandboxMode: z.boolean(),
})

const alipayFormSchema = z.object({
  enabled: z.boolean(),
  appId: z.string().min(1, {
    message: "AppID不能为空",
  }),
  privateKey: z.string().min(1, {
    message: "私钥不能为空",
  }),
  publicKey: z.string().min(1, {
    message: "公钥不能为空",
  }),
  notifyUrl: z.string().url({
    message: "请输入有效的回调URL",
  }),
  sandboxMode: z.boolean(),
})

export function PaymentGatewaySettings() {
  const [isSubmittingWechat, setIsSubmittingWechat] = useState(false)
  const [isSubmittingAlipay, setIsSubmittingAlipay] = useState(false)

  const wechatForm = useForm<z.infer<typeof wechatFormSchema>>({
    resolver: zodResolver(wechatFormSchema),
    defaultValues: {
      enabled: true,
      appId: "wx123456789abcdef",
      mchId: "1234567890",
      apiKey: "abcdefghijklmnopqrstuvwxyz123456",
      certPath: "/path/to/cert/apiclient_cert.p12",
      notifyUrl: "https://example.com/api/notify/wechat",
      sandboxMode: true,
    },
  })

  const alipayForm = useForm<z.infer<typeof alipayFormSchema>>({
    resolver: zodResolver(alipayFormSchema),
    defaultValues: {
      enabled: true,
      appId: "2021000000000000",
      privateKey: "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgw...",
      publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...",
      notifyUrl: "https://example.com/api/notify/alipay",
      sandboxMode: true,
    },
  })

  async function onSubmitWechat(values: z.infer<typeof wechatFormSchema>) {
    setIsSubmittingWechat(true)

    try {
      // 这里应该调用API保存设置
      console.log("保存微信支付设置:", values)

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "设置已保存",
        description: "微信支付配置已成功更新",
      })
    } catch (error) {
      console.error("保存设置失败:", error)
      toast({
        title: "保存失败",
        description: "无法保存微信支付设置，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingWechat(false)
    }
  }

  async function onSubmitAlipay(values: z.infer<typeof alipayFormSchema>) {
    setIsSubmittingAlipay(true)

    try {
      // 这里应该调用API保存设置
      console.log("保存支付宝设置:", values)

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "设置已保存",
        description: "支付宝配置已成功更新",
      })
    } catch (error) {
      console.error("保存设置失败:", error)
      toast({
        title: "保存失败",
        description: "无法保存支付宝设置，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingAlipay(false)
    }
  }

  return (
    <Tabs defaultValue="wechat" className="space-y-4 w-full">
      <TabsList>
        <TabsTrigger value="wechat">微信支付</TabsTrigger>
        <TabsTrigger value="alipay">支付宝</TabsTrigger>
      </TabsList>
      <TabsContent value="wechat">
        <Card>
          <CardHeader>
            <CardTitle>微信支付配置</CardTitle>
            <CardDescription>配置微信支付网关参数</CardDescription>
          </CardHeader>
          <Form {...wechatForm}>
            <form onSubmit={wechatForm.handleSubmit(onSubmitWechat)}>
              <CardContent className="space-y-6">
                <FormField
                  control={wechatForm.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">启用微信支付</FormLabel>
                        <FormDescription>启用后，系统将接受微信支付</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={wechatForm.control}
                    name="appId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AppID</FormLabel>
                        <FormControl>
                          <Input placeholder="输入微信AppID" {...field} />
                        </FormControl>
                        <FormDescription>微信支付分配的AppID</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={wechatForm.control}
                    name="mchId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>商户号</FormLabel>
                        <FormControl>
                          <Input placeholder="输入微信商户号" {...field} />
                        </FormControl>
                        <FormDescription>微信支付分配的商户号</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={wechatForm.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API密钥</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="输入API密钥" {...field} />
                      </FormControl>
                      <FormDescription>微信支付API密钥，用于签名验证</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={wechatForm.control}
                  name="certPath"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>证书路径</FormLabel>
                      <FormControl>
                        <Input placeholder="输入证书路径" {...field} />
                      </FormControl>
                      <FormDescription>微信支付API证书路径，用于退款等操作</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={wechatForm.control}
                  name="notifyUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>回调URL</FormLabel>
                      <FormControl>
                        <Input placeholder="输入回调URL" {...field} />
                      </FormControl>
                      <FormDescription>微信支付异步通知回调URL</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={wechatForm.control}
                  name="sandboxMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">沙箱模式</FormLabel>
                        <FormDescription>启用沙箱模式进行测试，不会产生真实交易</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isSubmittingWechat}>
                  {isSubmittingWechat ? "保存中..." : "保存设置"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>
      <TabsContent value="alipay">
        <Card>
          <CardHeader>
            <CardTitle>支付宝配置</CardTitle>
            <CardDescription>配置支付宝网关参数</CardDescription>
          </CardHeader>
          <Form {...alipayForm}>
            <form onSubmit={alipayForm.handleSubmit(onSubmitAlipay)}>
              <CardContent className="space-y-6">
                <FormField
                  control={alipayForm.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">启用支付宝</FormLabel>
                        <FormDescription>启用后，系统将接受支付宝支付</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={alipayForm.control}
                  name="appId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AppID</FormLabel>
                      <FormControl>
                        <Input placeholder="输入支付宝AppID" {...field} />
                      </FormControl>
                      <FormDescription>支付宝分配的AppID</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={alipayForm.control}
                  name="privateKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>应用私钥</FormLabel>
                      <FormControl>
                        <Input
                          as="textarea"
                          className="min-h-[100px] font-mono text-xs"
                          placeholder="输入应用私钥"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>PKCS8格式的应用私钥</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={alipayForm.control}
                  name="publicKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>支付宝公钥</FormLabel>
                      <FormControl>
                        <Input
                          as="textarea"
                          className="min-h-[100px] font-mono text-xs"
                          placeholder="输入支付宝公钥"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>支付宝公钥，用于验证签名</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={alipayForm.control}
                  name="notifyUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>回调URL</FormLabel>
                      <FormControl>
                        <Input placeholder="输入回调URL" {...field} />
                      </FormControl>
                      <FormDescription>支付宝异步通知回调URL</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={alipayForm.control}
                  name="sandboxMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">沙箱模式</FormLabel>
                        <FormDescription>启用沙箱模式进行测试，不会产生真实交易</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isSubmittingAlipay}>
                  {isSubmittingAlipay ? "保存中..." : "保存设置"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
