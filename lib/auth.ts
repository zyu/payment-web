// app/lib/auth.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';

// JWT密钥（与login route中保持一致）
const JWT_SECRET = new TextEncoder().encode('your-secret-key');

// 用户认证函数
export async function getUserAuth(request: NextRequest) {
  // 从 cookie 获取认证 token
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }
  
  try {
    // 验证token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as number,
      username: payload.username as string,
      token
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// 创建认证中间件
export async function withAuth(
  request: NextRequest,
  handler: (auth: { userId: number; username: string; token: string }) => Promise<NextResponse>
) {
  const auth = await getUserAuth(request);
  
  if (!auth) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  
  return handler(auth);
}

// 创建JWT令牌
export async function createJWT(payload: any) {
  const { SignJWT } = await import('jose');
  
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(JWT_SECRET);
}