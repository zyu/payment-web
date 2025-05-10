"use client"

import type React from "react"

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  Pie,
  Cell,
} from "recharts"

export const Chart = ({ data, children }: { data: any[]; children: React.ReactNode }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>{children}</ComposedChart>
    </ResponsiveContainer>
  )
}

export const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export const ChartTooltip = ({ content }: { content: React.ReactNode }) => {
  return <Tooltip content={content} />
}

export const ChartTooltipContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="rounded-md border bg-popover p-4">{children}</div>
}

export const ChartGrid = ({ horizontal, vertical }: { horizontal?: boolean; vertical?: boolean }) => {
  return <CartesianGrid stroke="#f5f5f5" horizontal={horizontal} vertical={vertical} />
}

export const ChartLine = ({
  dataKey,
  stroke,
  strokeWidth,
  dot,
  name,
  yAxisId,
}: { dataKey: string; stroke: string; strokeWidth: number; dot?: any; name?: string; yAxisId?: string }) => {
  return (
    <Line
      type="monotone"
      dataKey={dataKey}
      stroke={stroke}
      strokeWidth={strokeWidth}
      dot={dot}
      name={name}
      yAxisId={yAxisId}
    />
  )
}

export const ChartBar = ({ dataKey, fill, name }: { dataKey: string; fill: string; name?: string }) => {
  return <Bar dataKey={dataKey} fill={fill} name={name} />
}

export const ChartXAxis = ({ dataKey }: { dataKey: string }) => {
  return <XAxis dataKey={dataKey} />
}

export const ChartYAxis = ({ yAxisId }: { yAxisId?: string }) => {
  return <YAxis yAxisId={yAxisId} />
}

export const ChartLegend = ({
  verticalAlign,
  align,
  layout,
  iconType,
  iconSize,
  formatter,
}: {
  verticalAlign?: "top" | "middle" | "bottom"
  align?: "left" | "center" | "right"
  layout?: "horizontal" | "vertical"
  iconType?: "circle" | "rect" | "line" | "plainline" | "square" | "triangle" | "star" | "wye"
  iconSize?: number
  formatter?: (value: string) => string
}) => {
  return (
    <Legend
      verticalAlign={verticalAlign}
      align={align}
      layout={layout}
      iconType={iconType}
      iconSize={iconSize}
      formatter={formatter}
    />
  )
}

export const ChartArea = ({ dataKey, fill, name }: { dataKey: string; fill: string; name?: string }) => {
  return <Area type="monotone" dataKey={dataKey} stroke={fill} fill={fill} name={name} />
}

export const ChartPie = ({
  dataKey,
  nameKey,
  innerRadius,
  outerRadius,
  paddingAngle,
  cornerRadius,
  colors,
}: {
  dataKey: string
  nameKey: string
  innerRadius: number
  outerRadius: number
  paddingAngle: number
  cornerRadius: number
  colors: string[]
}) => {
  return (
    <Pie
      dataKey={dataKey}
      nameKey={nameKey}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      paddingAngle={paddingAngle}
      cornerRadius={cornerRadius}
      data={[]}
    >
      {colors.map((color, index) => (
        <Cell key={`cell-${index}`} fill={color} />
      ))}
    </Pie>
  )
}
