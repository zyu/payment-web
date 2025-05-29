"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, BarChart3, Package, RefreshCcw, Settings, LogOut } from "lucide-react"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      // // 调用登出API
      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      //   method: "POST",
      //   credentials: "include",
      // })

      // 清除本地存储的token
      localStorage.removeItem("authToken")

      // 重定向到登录页面
      window.location.href = "/login"
    } catch (error) {
      console.error("登出失败", error)
    }
  }

  const menuItems = [
    {
      title: "订单管理",
      href: "/dashboard/orders",
      icon: Package,
      submenu: [
        { title: "所有订单", href: "/dashboard/orders" },
        { title: "创建订单", href: "/dashboard/orders/create" },
      ],
    },
    {
      title: "退款管理",
      href: "/dashboard/refunds",
      icon: RefreshCcw,
      submenu: [
        { title: "所有退款", href: "/dashboard/refunds" },
        { title: "申请退款", href: "/dashboard/refunds/create" },
      ],
    },
    // {
    //   title: "数据分析",
    //   href: "/dashboard/analytics",
    //   icon: BarChart3,
    //   submenu: [
    //     { title: "销售概览", href: "/dashboard/analytics" },
    //     { title: "支付分析", href: "/dashboard/analytics/payments" },
    //   ],
    // },
    // {
    //   title: "系统设置",
    //   href: "/dashboard/settings",
    //   icon: Settings,
    //   submenu: [
    //     { title: "基本设置", href: "/dashboard/settings" },
    //     { title: "支付设置", href: "/dashboard/settings/payment" },
    //     { title: "安全设置", href: "/dashboard/settings/security" },
    //   ],
    // },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* 桌面侧边栏 */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex h-14 items-center border-b px-4 border-gray-200 dark:border-gray-700">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6" />
            <span className="text-lg font-bold">支付管理系统</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            {menuItems.map((item) => (
              <div key={item.href} className="mb-2">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700",
                    pathname === item.href ? "bg-gray-100 dark:bg-gray-700" : "transparent",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
                {item.submenu && (
                  <div className="ml-6 mt-1 grid gap-1">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.href}
                        href={subitem.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700",
                          pathname === subitem.href ? "bg-gray-100 dark:bg-gray-700" : "transparent",
                        )}
                      >
                        {subitem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            退出登录
          </Button>
        </div>
      </aside>

      {/* 移动端菜单 */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">打开菜单</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-14 items-center border-b px-4 border-gray-200 dark:border-gray-700">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Package className="h-6 w-6" />
              <span className="text-lg font-bold">支付管理系统</span>
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">关闭菜单</span>
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <nav className="grid gap-1 p-2">
              {menuItems.map((item) => (
                <div key={item.href} className="mb-2">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700",
                      pathname === item.href ? "bg-gray-100 dark:bg-gray-700" : "transparent",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                  {item.submenu && (
                    <div className="ml-6 mt-1 grid gap-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700",
                            pathname === subitem.href ? "bg-gray-100 dark:bg-gray-700" : "transparent",
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subitem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </ScrollArea>
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              退出登录
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* 主内容区域 */}
      <main className="flex-1 md:ml-64 min-h-screen">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white dark:bg-gray-800 px-4 md:px-6 border-gray-200 dark:border-gray-700">
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold">支付管理系统</h1>
          </div>
          <div className="ml-auto flex items-center gap-4">{/* 这里可以添加用户头像、通知图标等 */}</div>
        </header>
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  )
}
