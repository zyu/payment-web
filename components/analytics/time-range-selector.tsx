"use client"

import { useState } from "react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface TimeRangeProps {
  onChange: (range: { start_date: string; end_date: string }) => void
}

export function TimeRangeSelector({ onChange }: TimeRangeProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })

  const handleDateChange = (range: DateRange | undefined) => {
    setDate(range)
    if (range?.from && range?.to) {
      onChange({
        start_date: format(range.from, "yyyy-MM-dd"),
        end_date: format(range.to, "yyyy-MM-dd"),
      })
    }
  }

  const handlePresetChange = (value: string) => {
    const now = new Date()
    let from: Date

    switch (value) {
      case "today":
        from = new Date(now)
        break
      case "yesterday":
        from = new Date(now)
        from.setDate(from.getDate() - 1)
        break
      case "7days":
        from = new Date(now)
        from.setDate(from.getDate() - 7)
        break
      case "30days":
        from = new Date(now)
        from.setDate(from.getDate() - 30)
        break
      case "thisMonth":
        from = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "lastMonth":
        from = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        now.setDate(0) // Last day of previous month
        break
      default:
        return
    }

    const newRange = { from, to: now }
    setDate(newRange)
    onChange({
      start_date: format(from, "yyyy-MM-dd"),
      end_date: format(now, "yyyy-MM-dd"),
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <Select onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="选择时间范围" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">今天</SelectItem>
          <SelectItem value="yesterday">昨天</SelectItem>
          <SelectItem value="7days">过去7天</SelectItem>
          <SelectItem value="30days">过去30天</SelectItem>
          <SelectItem value="thisMonth">本月</SelectItem>
          <SelectItem value="lastMonth">上月</SelectItem>
        </SelectContent>
      </Select>

      <div className="grid gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "PPP", { locale: zhCN })} - {format(date.to, "PPP", { locale: zhCN })}
                  </>
                ) : (
                  format(date.from, "PPP", { locale: zhCN })
                )
              ) : (
                <span>选择日期范围</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={2}
              locale={zhCN}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
