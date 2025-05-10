// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

// 模拟用户数据（在实际应用中应该从数据库获取）
const users = [
  { id: 1, username: 'admin', password: 'password123' },
];

// 模拟 JWT 密钥（在生产环境中应该使用环境变量）
const JWT_SECRET = new TextEncoder().encode('your-secret-key');

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 验证用户名和密码
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      return NextResponse.json(
        { message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 创建 JWT token
    const token = await new SignJWT({ userId: user.id, username: user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(JWT_SECRET);

    // 创建响应对象
    const response = NextResponse.json({ 
      success: true,
      user: { id: user.id, username: user.username }
    });
    
    // 使用响应对象设置cookie
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 2, // 2 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { message: '服务器错误' },
      { status: 500 }
    );
  }
}