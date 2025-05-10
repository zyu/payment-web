import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// 创建退款申请API
export async function POST(request: NextRequest) {
  try {
    // 验证用户认证
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    // 解析请求体
    const refundData = await request.json();

    // 调用后端API
    const backendApiUrl = `${process.env.BACKEND_API_URL}/refunds`;
    const response = await fetch(backendApiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token.accessToken}`,
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