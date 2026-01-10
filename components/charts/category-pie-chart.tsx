"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { transactionTypes } from "@/lib/data/types";
import type { CategoryBreakdown } from "@/lib/types/transaction";

interface CategoryPieChartProps {
  data: CategoryBreakdown[];
}

/**
 * Pie chart showing expense breakdown by category.
 */
export function CategoryPieChart({ data }: CategoryPieChartProps) {
  // Build chart config from transaction types
  const chartConfig = data.reduce((acc, item) => {
    const typeConfig =
      transactionTypes[item.type as keyof typeof transactionTypes];
    acc[item.type] = {
      label: typeConfig?.label ?? item.type,
      color: typeConfig?.color ?? "#6b7280",
    };
    return acc;
  }, {} as ChartConfig);

  const chartData = data.map((item) => ({
    name: item.type,
    value: item.total,
    fill:
      transactionTypes[item.type as keyof typeof transactionTypes]?.color ??
      "#6b7280",
  }));

  const total = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <PieChart accessibilityLayer>
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name) => {
                const label =
                  transactionTypes[name as keyof typeof transactionTypes]
                    ?.label ?? name;
                const percentage = ((Number(value) / total) * 100).toFixed(1);
                return `${label}: ₱${Number(value).toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })} (${percentage}%)`;
              }}
            />
          }
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          verticalAlign="bottom"
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={40}
          paddingAngle={2}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
