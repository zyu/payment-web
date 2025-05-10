/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/ad',  // 用户访问的路径
        destination: '/ad.html',  // 实际返回的public目录下的文件
      },
    ]
  }
}

export default nextConfig
