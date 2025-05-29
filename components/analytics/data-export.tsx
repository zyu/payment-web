"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { analyticsApi, type AnalyticsTimeRange } from "@/app/services/analytics-service"
import { useToast } from "@/hooks/use-toast"

interface DataExportProps {
  timeRange: AnalyticsTimeRange
}

export function DataExport({ timeRange }: DataExportProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    try {
      setIsExporting(true)
      const blob = await analyticsApi.exportData(timeRange, format)

      // 创建下载链接
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `订单数据_${timeRange.start_date}_${timeRange.end_date}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "导出成功",
        description: `数据已成功导出为${format.toUpperCase()}格式`,
      })
    } catch (error) {
      toast({
        title: "导出失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "导出中..." : "导出数据"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport("csv")}>导出为CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>导出为Excel</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("pdf")}>导出为PDF</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
