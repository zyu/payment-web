/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除 output: 'export' 配置，使用默认的服务器渲染
  build: "next build",
  
  // 禁用默认的404页面生成
  // 这将使用我们自定义的not-found.tsx
  experimental: {
    // 禁用一些可能导致问题的实验性功能
    serverActions: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // 对于静态导出，需要禁用图像优化
  },
}

export default nextConfig
