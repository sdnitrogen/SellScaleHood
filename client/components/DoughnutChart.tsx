"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const DoughNutChart = ({ holdings, cash, stocks }: DoughnutChartProps) => {
  // create and configure the data for the donut chart
  const chartData = holdings.map((hold) => ({
    name: hold.ticker,
    value:
      hold.volume *
      (stocks.find((stock) => stock.symbol === hold.ticker)?.currentPrice ?? 0),
    fill: `var(--color-${hold.ticker})`,
  }))

  chartData.push({
    name: "Cash",
    value: cash,
    fill: "var(--color-Cash)",
  })

  const chartConfig = chartData.reduce(
    (o, key, i) => ({
      ...o,
      [key.name]: {
        label: key.name,
        color: `hsl(var(--chart-${(i % 10) + 1}))`,
      },
    }),
    {}
  ) satisfies ChartConfig

  const totalValue = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [chartData])

  return (
    <Card className="flex flex-col border-none shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Portfolio Value</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square min-h-[200px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-sm font-bold">
                          {`$${totalValue.toLocaleString()}`}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default DoughNutChart
