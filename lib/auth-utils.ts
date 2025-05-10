// app/lib/auth-utils.ts
/**
 * 从localStorage获取当前登录用户信息
 * 实际项目中应根据认证系统调整此函数
 */
export function getCurrentUser() {
  // 仅在客户端运行
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      return null;
    }

    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * 从localStorage获取认证token
 */
export function getAuthToken() {
  // 仅在客户端运行
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("auth-token");
}

/**
 * 设置认证信息到localStorage
 */
export function setAuthInfo(user: any) {
  // 仅在客户端运行
  if (typeof window === "undefined") {
    return;
  }

  // token已经通过cookie设置，这里只存储用户信息
  localStorage.setItem("user", JSON.stringify(user));
}

/**
 * 清除认证信息
 */
export function clearAuthInfo() {
  // 仅在客户端运行
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("user");
}

/**
 * 检查用户是否已登录
 */
export function isAuthenticated() {
  return !!getCurrentUser();
}

/**
 * 在组件中检查认证状态并重定向
 * 可以在需要保护的组件中使用这个函数
 */
export async function checkAuthAndRedirect(router: any) {
  const user = getCurrentUser();

  if (!user) {
    router.push("/login");
    return null;
  }

  return user;
}
