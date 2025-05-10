"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  systemName: z.string().min(2, {
    message: "系统名称至少需要2个字符",
  }),
  companyName: z.string().min(2, {
    message: "公司名称至少需要2个字符",
  }),
  contactEmail: z.string().email({
    message: "请输入有效的电子邮箱",
  }),
  contactPhone: z.string().regex(/^1[3-9]\d{9}$/, {
    message: "请输入有效的手机号码",
  }),
  timezone: z.string({
    required_error: "请选择时区",
  }),
  dateFormat: z.string({
    required_error: "请选择日期格式",
  }),
})

export function GeneralSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      systemName: "支付集成管理系统",
      companyName: "示例科技有限公司",
      contactEmail: "admin@example.com",
      contactPhone: "13800138000",
      timezone: "Asia/Shanghai",
      dateFormat: "YYYY-MM-DD HH:mm:ss",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // 这里应该调用API保存设置
      console.log("保存设置:", values)

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "设置已保存",
        description: "基本设置已成功更新",
      })
    } catch (error) {
      console.error("保存设置失败:", error)
      toast({
        title: "保存失败",
        description: "无法保存设置，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>基本设置</CardTitle>
        <CardDescription>配置系统的基本信息和显示格式</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="systemName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>系统名称</FormLabel>
                    <FormControl>
                      <Input placeholder="输入系统名称" {...field} />
                    </FormControl>
                    <FormDescription>显示在浏览器标签和系统界面上的名称</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>公司名称</FormLabel>
                    <FormControl>
                      <Input placeholder="输入公司名称" {...field} />
                    </FormControl>
                    <FormDescription>用于显示在发票和收据上的公司名称</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>联系邮箱</FormLabel>
                    <FormControl>
                      <Input placeholder="输入联系邮箱" {...field} />
                    </FormControl>
                    <FormDescription>用于系统通知和客户联系</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>联系电话</FormLabel>
                    <FormControl>
                      <Input placeholder="输入联系电话" {...field} />
                    </FormControl>
                    <FormDescription>用于紧急联系和客户支持</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>时区</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择时区" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Asia/Shanghai">中国标准时间 (UTC+8)</SelectItem>
                        <SelectItem value="Asia/Hong_Kong">香港时间 (UTC+8)</SelectItem>
                        <SelectItem value="Asia/Tokyo">东京时间 (UTC+9)</SelectItem>
                        <SelectItem value="America/New_York">纽约时间 (UTC-5)</SelectItem>
                        <SelectItem value="Europe/London">伦敦时间 (UTC+0)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>系统使用的默认时区</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>日期格式</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择日期格式" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</SelectItem>
                        <SelectItem value="YYYY/MM/DD HH:mm:ss">YYYY/MM/DD HH:mm:ss</SelectItem>
                        <SelectItem value="DD/MM/YYYY HH:mm:ss">DD/MM/YYYY HH:mm:ss</SelectItem>
                        <SelectItem value="MM/DD/YYYY HH:mm:ss">MM/DD/YYYY HH:mm:ss</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>系统显示的日期时间格式</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : "保存设置"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
