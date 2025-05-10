// app/api/orders/[orderId]/route.ts
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

export async function GET(
  request: NextRequest,
  context: { params: { orderId: string } }
) {
  try {
    // 验证用户认证
    const auth = await getUserAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }
    const { params } = context;
    // 确保params存在并且orderId是可用的
    if (!params) {
        console.error("Missing params object");
        return NextResponse.json({ error: "缺少参数" }, { status: 400 });
    }

    console.log(params)
    const orderId = params.orderId;

    // 调用后端API
    const backendApiUrl = `${process.env.BACKEND_API_URL}/orders/${orderId}`;
    console.log(backendApiUrl)
    const response = await fetch(backendApiUrl, {
      headers: {
        "Authorization": `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "订单不存在" },
          { status: 404 }
        );
      }
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || "获取订单详情失败" },
        { status: response.status }
      );
    }

    const order = await response.json();
    return NextResponse.json(order);
  } catch (error) {
    console.error("获取订单详情错误:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}

// 更新订单状态API
export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    // 验证用户认证
    const auth = await getUserAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const orderId = params.orderId;
    const updateData = await request.json();

    // 调用后端API
    const backendApiUrl = `${process.env.BACKEND_API_URL}/orders/${orderId}`;
    const response = await fetch(backendApiUrl, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "订单不存在" },
          { status: 404 }
        );
      }
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || "更新订单失败" },
        { status: response.status }
      );
    }

    const updatedOrder = await response.json();
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("更新订单错误:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}