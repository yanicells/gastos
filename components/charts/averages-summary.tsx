"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RollingAverages } from "@/lib/queries/analytics";

interface AveragesSummaryProps {
  averages: RollingAverages;
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
 * Averages summary row for charts page.
 * Shows daily, weekly, and monthly averages in cards.
 */
export function AveragesSummary({ averages }: AveragesSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <AverageCard
        title="Daily Average"
        income={averages.daily.income}
        expenses={averages.daily.expenses}
        savings={averages.daily.savings}
      />
      <AverageCard
        title="Weekly Average"
        income={averages.weekly.income}
        expenses={averages.weekly.expenses}
        savings={averages.weekly.savings}
      />
      <AverageCard
        title="Monthly Average"
        income={averages.monthly.income}
        expenses={averages.monthly.expenses}
        savings={averages.monthly.savings}
      />
    </div>
  );
}

interface AverageCardProps {
  title: string;
  income: number;
  expenses: number;
  savings: number;
}

function AverageCard({ title, income, expenses, savings }: AverageCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Income</span>
          <span className="font-medium text-green-500 tabular-nums">
            {formatCurrency(income)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Expenses</span>
          <span className="font-medium text-red-500 tabular-nums">
            {formatCurrency(expenses)}
          </span>
        </div>
        <div className="flex justify-between text-sm pt-1 border-t">
          <span className="text-muted-foreground">Savings</span>
          <span
            className={`font-medium tabular-nums ${
              savings >= 0 ? "text-blue-500" : "text-red-500"
            }`}
          >
            {formatCurrency(savings)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
