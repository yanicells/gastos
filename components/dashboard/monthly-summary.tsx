"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Receipt,
  Calendar,
  CalendarDays,
} from "lucide-react";
import type { PeriodStats } from "@/lib/types/analytics";

interface SummaryStatsProps {
  todaySpend: number;
  weeklyExpenses: number;
  monthlyExpenses: number;
  yearlyStats: PeriodStats;
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
 * Summary stats component with 2x3 grid of stat cards.
 * Row 1: Today, Weekly, Monthly (expenses)
 * Row 2: Income, Expenses, Savings (yearly)
 */
export function SummaryStats({
  todaySpend,
  weeklyExpenses,
  monthlyExpenses,
  yearlyStats,
}: SummaryStatsProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 h-full">
          {/* Row 1: Expense periods */}
          <StatCard
            label="Today"
            value={todaySpend}
            icon={<Receipt className="h-4 w-4 lg:h-5 lg:w-5" />}
            color="text-orange-500"
            bgColor="bg-orange-500/10"
          />
          <StatCard
            label="Weekly"
            value={weeklyExpenses}
            icon={<Calendar className="h-4 w-4 lg:h-5 lg:w-5" />}
            color="text-rose-500"
            bgColor="bg-rose-500/10"
          />
          <StatCard
            label="Monthly"
            value={monthlyExpenses}
            icon={<CalendarDays className="h-4 w-4 lg:h-5 lg:w-5" />}
            color="text-purple-500"
            bgColor="bg-purple-500/10"
          />
          {/* Row 2: Yearly totals */}
          <StatCard
            label="Expenses"
            value={yearlyStats.expenses}
            icon={<TrendingDown className="h-4 w-4 lg:h-5 lg:w-5" />}
            color="text-red-500"
            bgColor="bg-red-500/10"
          />
          <StatCard
            label="Income"
            value={yearlyStats.income}
            icon={<Wallet className="h-4 w-4 lg:h-5 lg:w-5" />}
            color="text-green-500"
            bgColor="bg-green-500/10"
          />
          <StatCard
            label="Savings"
            value={yearlyStats.savings}
            icon={<PiggyBank className="h-4 w-4 lg:h-5 lg:w-5" />}
            color={yearlyStats.savings >= 0 ? "text-blue-500" : "text-red-500"}
            bgColor={
              yearlyStats.savings >= 0 ? "bg-blue-500/10" : "bg-red-500/10"
            }
          />
        </div>
      </CardContent>
    </Card>
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
    <div className="flex flex-col justify-center gap-2 p-4 rounded-xl border bg-card/50 shadow-sm transition-all hover:bg-accent/50 h-full">
      <div className="flex items-center gap-2 text-muted-foreground">
        <div
          className={`p-1.5 rounded-md ${bgColor} ${color} bg-background lg:p-2`}
        >
          {icon}
        </div>
        <span className="text-sm font-medium lg:text-base">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className={`text-2xl font-bold tracking-tight ${color} lg:text-3xl`}
        >
          {formatCurrency(value)}
        </span>
      </div>
    </div>
  );
}
