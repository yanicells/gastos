"use client";

import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wallet, TrendingDown, PiggyBank, Receipt } from "lucide-react";
import type { PeriodStats, RollingAverages } from "@/lib/types/analytics";

interface SummaryStatsProps {
  currentMonth: PeriodStats;
  averages: RollingAverages;
  todaySpend: number;
}

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
 * Summary stats component with tabs for "This Month" and "Averages".
 */
export function SummaryStats({
  currentMonth,
  averages,
  todaySpend,
}: SummaryStatsProps) {
  return (
    <Card className="h-full">
      <CardContent className="space-y-6 pt-6">
        <ThisMonthView stats={currentMonth} todaySpend={todaySpend} />
        <AveragesView averages={averages} />
      </CardContent>
    </Card>
  );
}

/**
 * This month view - 4 stat cards.
 */
function ThisMonthView({
  stats,
  todaySpend,
}: {
  stats: PeriodStats;
  todaySpend: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Today"
        value={todaySpend}
        icon={<Receipt className="h-4 w-4" />}
        color="text-orange-500"
        bgColor="bg-orange-500/10"
      />
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
    <div className="flex flex-col gap-2 p-4 rounded-xl border bg-card/50 shadow-sm transition-all hover:bg-accent/50">
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className={`p-1.5 rounded-md ${bgColor} ${color} bg-background`}>
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold tracking-tight ${color}`}>
          {formatCurrency(value)}
        </span>
      </div>
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
            <TableHead className="w-25">Metric</TableHead>
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
