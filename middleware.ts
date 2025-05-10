// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// 不需要认证的路径
const publicPaths = [
  "/login",
  "/api/login",
  "/ad",
  "/alipay-icon.png",
  "/image/dog3.jpg",
  "/image/dog5.jpg",
  "/image/dog7.jpg",
  "/favicon.ico",
  "/wechat-icon.png",
  "/_next/static",
  "/_next/image",
];

// JWT密钥（与login route中保持一致）
const JWT_SECRET = new TextEncoder().encode("your-secret-key");

// 验证token
async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否是公开路径
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 验证token
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    // 重定向到登录页面
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const payload = await verifyToken(token);
    if (!payload) {
      // token无效，重定向到登录页面
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // token有效，继续
    return NextResponse.next();
  } catch (error) {
    // 验证失败，重定向到登录页面
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// 配置中间件匹配的路径
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
