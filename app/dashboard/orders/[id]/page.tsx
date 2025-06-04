import OrderDetailPageClient from "./OrderDetailPageClient"

// 添加这个函数到文件顶部
export function generateStaticParams() {
  // 为静态导出提供一些预定义的ID
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }]
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params
  console.log("Resolved Params:", resolvedParams)
  return <OrderDetailPageClient orderId={resolvedParams.id} />
}
