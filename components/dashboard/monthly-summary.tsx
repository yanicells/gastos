"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wallet, TrendingDown, PiggyBank } from "lucide-react";
import type { PeriodStats, RollingAverages } from "@/lib/queries/analytics";

interface SummaryStatsProps {
  currentMonth: PeriodStats;
  averages: RollingAverages;
}

type ViewMode = "this-month" | "averages";

/**
 * Format amount as Philippine Peso.
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Summary stats component with toggle between "This Month" and "Averages".
 */
export function SummaryStats({ currentMonth, averages }: SummaryStatsProps) {
  const [view, setView] = useState<ViewMode>("this-month");

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Summary</CardTitle>
        <Select value={view} onValueChange={(val) => setView(val as ViewMode)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" align="end">
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="averages">Averages</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {view === "this-month" ? (
          <ThisMonthView stats={currentMonth} />
        ) : (
          <AveragesView averages={averages} />
        )}
      </CardContent>
    </Card>
  );
}

/**
 * This month view - 3 stat cards.
 */
function ThisMonthView({ stats }: { stats: PeriodStats }) {
  return (
    <div className="grid gap-4">
      <StatCard
        label="Income"
        value={stats.income}
        icon={<Wallet className="h-4 w-4" />}
        color="text-green-500"
        bgColor="bg-green-500/10"
      />
      <StatCard
        label="Expenses"
        value={stats.expenses}
        icon={<TrendingDown className="h-4 w-4" />}
        color="text-red-500"
        bgColor="bg-red-500/10"
      />
      <StatCard
        label="Savings"
        value={stats.savings}
        icon={<PiggyBank className="h-4 w-4" />}
        color={stats.savings >= 0 ? "text-blue-500" : "text-red-500"}
        bgColor={stats.savings >= 0 ? "bg-blue-500/10" : "bg-red-500/10"}
      />
    </div>
  );
}

/**
 * Stat card component.
 */
function StatCard({
  label,
  value,
  icon,
  color,
  bgColor,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-md ${bgColor} ${color}`}>{icon}</div>
        <span className="font-medium">{label}</span>
      </div>
      <span className={`text-lg font-bold tabular-nums ${color}`}>
        {formatCurrency(value)}
      </span>
    </div>
  );
}

/**
 * Averages view - table with daily/weekly/monthly.
 */
function AveragesView({ averages }: { averages: RollingAverages }) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Metric</TableHead>
            <TableHead className="text-right">Daily</TableHead>
            <TableHead className="text-right">Weekly</TableHead>
            <TableHead className="text-right">Monthly</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium text-green-500">Income</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(averages.daily.income)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(averages.weekly.income)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(averages.monthly.income)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-red-500">Expenses</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(averages.daily.expenses)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(averages.weekly.expenses)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(averages.monthly.expenses)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-blue-500">Savings</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(averages.daily.savings)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(averages.weekly.savings)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(averages.monthly.savings)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
