"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getAuthToken, setAuthInfo, clearAuthInfo, isAuthenticated } from "@/lib/auth-utils"
import { authApi } from "@/app/services/api-service"

// 用户类型定义
interface User {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

// 认证上下文类型
interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => boolean
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 认证提供者组件属性
interface AuthProviderProps {
  children: ReactNode
}

// 认证提供者组件
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 初始化认证状态
  useEffect(() => {
    const initAuth = () => {
      const storedToken = getAuthToken()
      const storedUser = getCurrentUser()

      setToken(storedToken)
      setUser(storedUser)
      setIsLoading(false)
    }

    initAuth()
  }, [])

  // 登录函数 - 使用新的API接口
  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      // 调用登录API
      const data = await authApi.login({ email, password })

      // 存储认证信息
      setToken(data.token)
      setUser(data.user)
      setAuthInfo(data.token, data.user)

      // 登录成功后跳转到仪表盘
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // 退出登录
  const logout = () => {
    setToken(null)
    setUser(null)
    clearAuthInfo()
    router.push("/login")
  }

  // 检查用户是否已认证
  const checkAuth = () => {
    return isAuthenticated()
  }

  // 提供认证上下文
  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 使用认证上下文的Hook
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

// 保护需要认证的路由的高阶组件
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !user) {
        router.push("/login")
      }
    }, [user, isLoading, router])

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      )
    }

    if (!user) {
      return null
    }

    return <Component {...props} />
  }
}
