// 配置您的PHP后端API地址
// 在构建时，这将被替换为生产环境的URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export const config = {
  apiBaseUrl: API_BASE_URL,
  // 您可以在这里添加其他配置项
}

export default config
