import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';

// JWT密钥（与login route中保持一致）
const JWT_SECRET = new TextEncoder().encode('your-secret-key');

// 用户认证函数
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

// 发起支付宝支付API
export async function POST(
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
    
    // 解析请求体（可能包含return_url）
    const body = await request.json().catch(() => ({}));

    // 调用后端API
    const backendApiUrl = `${process.env.BACKEND_API_URL}/payment/alipay/pay/${orderId}`;
    const response = await fetch(backendApiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || "发起支付宝支付失败" },
        { status: response.status }
      );
    }

    const paymentParams = await response.json();
    return NextResponse.json(paymentParams);
  } catch (error) {
    console.error("发起支付宝支付错误:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}