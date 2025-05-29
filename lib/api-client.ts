import { config } from "./config"

/**
 * 通用API客户端，用于与PHP后端通信
 */
export const apiClient = {
  async get(endpoint: string) {
    const response = await fetch(`${config.apiBaseUrl}${endpoint}`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    return response.json()
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    return response.json()
  },

  async put(endpoint: string, data: any) {
    const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    return response.json()
  },

  async delete(endpoint: string) {
    const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    return response.json()
  },
}
