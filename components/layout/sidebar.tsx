"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { BarChart3, CreditCard, FileText, Home, LogOut, RotateCcw, Settings, User } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [username, setUsername] = useState<string>("管理员")
  
  // 在组件加载时检查用户是否已登录
  useEffect(() => {
    // 从 localStorage 检查用户信息
    const checkAuth = () => {
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        // 如果没有用户信息，重定向到登录页
        router.push('/login')
        return
      }
      
      try {
        const userData = JSON.parse(userStr)
        if (userData && userData.username) {
          setUsername(userData.username)
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        // 如果解析失败，重定向到登录页
        router.push('/login')
      }
    }
    
    // 检查认证状态
    checkAuth()
    
    // 可选：添加一个事件监听器，当localStorage改变时重新检查认证
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' && !e.newValue) {
        router.push('/login')
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [router])

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const handleLogout = async () => {
    try {
      // 调用登出 API 清除服务器端的 token/cookie
      const response = await fetch('/api/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // 清除本地存储的用户信息
      localStorage.removeItem('user')
      
      toast({
        title: "已登出",
        description: "您已成功退出登录"
      })
      
      if (response.ok) {
        // 登出成功，跳转到登录页
        router.push('/login');
      } else {
        console.error('Logout failed');
        // 即使登出 API 失败，也尝试跳转到登录页
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // 出错时也跳转到登录页
      router.push('/login');
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex h-14 items-center px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <CreditCard className="h-6 w-6" />
          <span>支付管理系统</span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
              <Link href="/dashboard">
                <Home />
                <span>仪表盘</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/orders")}>
              <Link href="/dashboard/orders">
                <FileText />
                <span>订单管理</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/payments")}>
              <Link href="/dashboard/payments">
                <CreditCard />
                <span>支付处理</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/refunds")}>
              <Link href="/dashboard/refunds">
                <RotateCcw />
                <span>退款管理</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/analytics")}>
              <Link href="/dashboard/analytics">
                <BarChart3 />
                <span>数据分析</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/settings")}>
              <Link href="/dashboard/settings">
                <Settings />
                <span>系统设置</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/profile">
                <User />
                <span>{username}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>退出登录</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}