"use client";

import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface TrendLineChartProps {
  data: { month: number; income: number; expense: number }[];
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const chartConfig = {
  expense: {
    label: "Expenses",
    color: "#ef4444",
  },
  income: {
    label: "Income",
    color: "#22c55e",
  },
} satisfies ChartConfig;

/**
 * Line chart showing monthly expense/income trends.
 */
export function TrendLineChart({ data }: TrendLineChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    name: MONTH_LABELS[item.month - 1],
  }));

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <LineChart data={chartData} accessibilityLayer>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) =>
                `₱${Number(value).toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}`
              }
            />
          }
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="var(--color-expense)"
          strokeWidth={2}
          dot={{ r: 4, fill: "var(--color-expense)" }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="income"
          stroke="var(--color-income)"
          strokeWidth={2}
          dot={{ r: 4, fill: "var(--color-income)" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
