// app/api/refunds/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// JWT密钥（与login route中保持一致）
const JWT_SECRET = new TextEncoder().encode('your-secret-key');

// 复用相同的用户认证函数
async function getUserAuth(request: NextRequest) {
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

// 创建退款申请API
export async function POST(request: NextRequest) {
  try {
    // 验证用户认证
    const auth = await getUserAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    // 解析请求体
    const refundData = await request.json();

    // 调用后端API
    const backendApiUrl = `${process.env.BACKEND_API_URL}/refunds`;
    const response = await fetch(backendApiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(refundData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || "创建退款申请失败" },
        { status: response.status }
      );
    }

    const createdRefund = await response.json();
    return NextResponse.json(createdRefund);
  } catch (error) {
    console.error("创建退款申请错误:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}