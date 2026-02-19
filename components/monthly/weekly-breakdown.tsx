"use client";

import * as Icons from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { transactionTypes } from "@/lib/data/types";
import type { WeeklyBreakdown } from "@/lib/types/analytics";
import type { CategoryBreakdown } from "@/lib/types/transaction";
import { cn } from "@/lib/utils";

interface WeeklyBreakdownProps {
  weeks: WeeklyBreakdown[];
}

interface BreakdownListProps {
  data: CategoryBreakdown[];
  type: "income" | "expense";
}

function BreakdownList({ data, type }: BreakdownListProps) {
  const total = data.reduce((acc, row) => acc + row.total, 0);

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">
        {type === "income" ? "Income by Category" : "Expense by Category"}
      </h4>

      {data.map((item) => {
        const config =
          transactionTypes[item.type as keyof typeof transactionTypes];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Icon = (Icons as any)[config.icon];
        const percentage = total > 0 ? (item.total / total) * 100 : 0;

        return (
          <div key={item.type} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "p-1.5 rounded-full bg-muted",
                    type === "expense" ? "text-red-500" : "text-green-500",
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                </div>
                <span className="font-medium">{config.label}</span>
              </div>
              <div className="text-right">
                <div className="font-bold">₱{item.total.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            </div>
            <Progress
              value={percentage}
              className={cn(
                "h-2",
                type === "expense"
                  ? "[&>div]:bg-red-500"
                  : "[&>div]:bg-green-500",
              )}
            />
          </div>
        );
      })}

      {data.length === 0 && (
        <p className="text-sm text-muted-foreground">No data available</p>
      )}
    </div>
  );
}

export function WeeklyBreakdownSection({ weeks }: WeeklyBreakdownProps) {
  return (
    <div className="space-y-4">
      {weeks.map((week) => (
        <Card key={`${week.startDate}-${week.endDate}`}>
          <CardHeader>
            <CardTitle className="text-base">{week.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Income</p>
                <p className="text-base font-semibold text-green-500 tabular-nums">
                  ₱{week.totals.income.toLocaleString()}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Expenses</p>
                <p className="text-base font-semibold text-red-500 tabular-nums">
                  ₱{week.totals.expenses.toLocaleString()}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Savings</p>
                <p
                  className={cn(
                    "text-base font-semibold tabular-nums",
                    week.totals.savings >= 0 ? "text-primary" : "text-red-500",
                  )}
                >
                  ₱{week.totals.savings.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <BreakdownList data={week.incomeBreakdown} type="income" />
              <BreakdownList data={week.expenseBreakdown} type="expense" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
