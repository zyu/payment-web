import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralSettings } from "@/components/settings/general-settings"
import { PaymentGatewaySettings } from "@/components/settings/payment-gateway-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { UserManagement } from "@/components/settings/user-management"

export const metadata: Metadata = {
  title: "系统设置 - 支付集成管理系统",
  description: "配置系统参数和支付网关",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">系统设置</h2>
        <p className="text-muted-foreground">管理系统配置和支付网关设置</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4 w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="general">基本设置</TabsTrigger>
          <TabsTrigger value="payment">支付网关</TabsTrigger>
          <TabsTrigger value="notification">通知设置</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
          <TabsTrigger value="users">用户管理</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="w-full">
          <GeneralSettings />
        </TabsContent>
        <TabsContent value="payment" className="w-full">
          <PaymentGatewaySettings />
        </TabsContent>
        <TabsContent value="notification" className="w-full">
          <NotificationSettings />
        </TabsContent>
        <TabsContent value="security" className="w-full">
          <SecuritySettings />
        </TabsContent>
        <TabsContent value="users" className="w-full">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
