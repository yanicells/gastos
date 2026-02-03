"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Receipt,
  Calendar,
  Target,
} from "lucide-react";
import type { PeriodStats } from "@/lib/types/analytics";

interface SummaryStatsProps {
  currentMonth: PeriodStats;
  todaySpend: number;
  weeklyExpenses: number;
  weeklySavings: number;
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
 */
export function SummaryStats({
  currentMonth,
  todaySpend,
  weeklyExpenses,
  weeklySavings,
}: SummaryStatsProps) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard
            label="Today"
            value={todaySpend}
            icon={<Receipt className="h-4 w-4" />}
            color="text-orange-500"
            bgColor="bg-orange-500/10"
          />
          <StatCard
            label="Income"
            value={currentMonth.income}
            icon={<Wallet className="h-4 w-4" />}
            color="text-green-500"
            bgColor="bg-green-500/10"
          />
          <StatCard
            label="Expenses"
            value={currentMonth.expenses}
            icon={<TrendingDown className="h-4 w-4" />}
            color="text-red-500"
            bgColor="bg-red-500/10"
          />
          <StatCard
            label="Savings"
            value={currentMonth.savings}
            icon={<PiggyBank className="h-4 w-4" />}
            color={currentMonth.savings >= 0 ? "text-blue-500" : "text-red-500"}
            bgColor={
              currentMonth.savings >= 0 ? "bg-blue-500/10" : "bg-red-500/10"
            }
          />
          <StatCard
            label="Weekly"
            value={weeklyExpenses}
            icon={<Calendar className="h-4 w-4" />}
            color="text-rose-500"
            bgColor="bg-rose-500/10"
          />
          <StatCard
            label="Weekly Savings"
            value={weeklySavings}
            icon={<Target className="h-4 w-4" />}
            color="text-cyan-500"
            bgColor="bg-cyan-500/10"
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
