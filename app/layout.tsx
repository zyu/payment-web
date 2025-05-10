import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster" // 添加Toaster导入

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "支付集成管理系统",
  description: "基于Next.js和FastAPI构建的支付集成管理系统",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
          <Toaster /> {/* 添加Toaster组件 */}
        </ThemeProvider>
      </body>
    </html>
  )
}
