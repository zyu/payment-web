// lib/auth-utils.ts

const AUTH_TOKEN_KEY = "authToken"
const CURRENT_USER_KEY = "currentUser"

export const getAuthToken = () => {
  if (typeof window === "undefined") {
    return null
  }
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export const getCurrentUser = () => {
  if (typeof window === "undefined") {
    return null
  }
  const userString = localStorage.getItem(CURRENT_USER_KEY)
  try {
    return userString ? JSON.parse(userString) : null
  } catch (error) {
    console.error("Error parsing user data:", error)
    return null
  }
}

export const setAuthInfo = (token: string, user: any) => {
  if (typeof window === "undefined") {
    return
  }
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

export const clearAuthInfo = () => {
  if (typeof window === "undefined") {
    return
  }
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(CURRENT_USER_KEY)
}

export const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false
  }
  return !!localStorage.getItem(AUTH_TOKEN_KEY)
}
