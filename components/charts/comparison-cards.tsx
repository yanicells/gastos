"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ComparisonCardsProps {
  currentMonth: { income: number; expense: number };
  previousMonth: { income: number; expense: number };
  sameMonthLastYear: { income: number; expense: number };
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
 * Calculate percentage change.
 */
function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Comparison cards showing MoM and YoY changes.
 */
export function ComparisonCards({
  currentMonth,
  previousMonth,
  sameMonthLastYear,
}: ComparisonCardsProps) {
  const momExpenseChange = calculateChange(
    currentMonth.expense,
    previousMonth.expense
  );
  const momIncomeChange = calculateChange(
    currentMonth.income,
    previousMonth.income
  );
  const yoyExpenseChange = calculateChange(
    currentMonth.expense,
    sameMonthLastYear.expense
  );
  const yoyIncomeChange = calculateChange(
    currentMonth.income,
    sameMonthLastYear.income
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* MoM Expenses */}
      <ComparisonCard
        title="Expenses vs Last Month"
        current={currentMonth.expense}
        change={momExpenseChange}
        isExpense={true}
      />

      {/* MoM Income */}
      <ComparisonCard
        title="Income vs Last Month"
        current={currentMonth.income}
        change={momIncomeChange}
        isExpense={false}
      />

      {/* YoY Expenses */}
      <ComparisonCard
        title="Expenses vs Last Year"
        current={currentMonth.expense}
        change={yoyExpenseChange}
        isExpense={true}
      />

      {/* YoY Income */}
      <ComparisonCard
        title="Income vs Last Year"
        current={currentMonth.income}
        change={yoyIncomeChange}
        isExpense={false}
      />
    </div>
  );
}

interface ComparisonCardProps {
  title: string;
  current: number;
  change: number;
  isExpense: boolean;
}

function ComparisonCard({
  title,
  current,
  change,
  isExpense,
}: ComparisonCardProps) {
  // For expenses: decrease is good (green), increase is bad (red)
  // For income: increase is good (green), decrease is bad (red)
  const isPositiveChange = isExpense ? change < 0 : change > 0;
  const isNeutral = change === 0;

  const Icon = isNeutral ? Minus : change > 0 ? TrendingUp : TrendingDown;
  const changeColor = isNeutral
    ? "text-muted-foreground"
    : isPositiveChange
    ? "text-green-500"
    : "text-red-500";
  const bgColor = isNeutral
    ? "bg-muted"
    : isPositiveChange
    ? "bg-green-500/10"
    : "bg-red-500/10";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">
          {formatCurrency(current)}
        </div>
        <div className={`flex items-center gap-1 mt-1 ${changeColor}`}>
          <div className={`p-0.5 rounded ${bgColor}`}>
            <Icon className="h-3 w-3" />
          </div>
          <span className="text-sm font-medium">
            {isNeutral ? "No change" : `${Math.abs(change).toFixed(1)}%`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
