import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  // 清除认证 cookie
  const cookieStore = cookies();
  cookieStore.delete('auth-token');
  
  // 重定向到登录页面
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
}