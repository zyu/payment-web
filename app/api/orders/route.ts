// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// JWT密钥（与login route中保持一致）
const JWT_SECRET = new TextEncoder().encode('your-secret-key');

// 获取用户认证函数
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

// 获取订单列表API
export async function GET(request: NextRequest) {
  try {
    // 验证用户认证
    const auth = await getUserAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    // 从URL参数中获取分页数据
    const url = new URL(request.url);
    const userId = url.searchParams.get("user_id") || auth.userId;
    const skip = parseInt(url.searchParams.get("skip") || "0");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    console.log(`${process.env.BACKEND_API_URL}`)
    // 调用后端API
    const backendApiUrl = `${process.env.BACKEND_API_URL}/orders/list?skip=${skip}&limit=${limit}`;
    const response = await fetch(backendApiUrl, {
      headers: {
        "Authorization": `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || "获取订单列表失败" },
        { status: response.status }
      );
    }

    const orders = await response.json();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("获取订单列表错误:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}

// 创建订单API
export async function POST(request: NextRequest) {
  try {
    // 验证用户认证
    const auth = await getUserAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    // 解析请求体
    const orderData = await request.json();

    // 如果未提供user_id，则使用当前登录用户的ID
    if (!orderData.user_id) {
      orderData.user_id = auth.userId;
    }

    // 调用后端API
    const backendApiUrl = `${process.env.BACKEND_API_URL}/orders`;
    const response = await fetch(backendApiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || "创建订单失败" },
        { status: response.status }
      );
    }

    const createdOrder = await response.json();
    return NextResponse.json(createdOrder);
  } catch (error) {
    console.error("创建订单错误:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}