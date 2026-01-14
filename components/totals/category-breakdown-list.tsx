"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { transactionTypes } from "@/lib/data/types";
import { CategoryBreakdown } from "@/lib/types/transaction";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

interface CategoryBreakdownListProps {
  data: CategoryBreakdown[];
  type: "income" | "expense";
}

export function CategoryBreakdownList({
  data,
  type,
}: CategoryBreakdownListProps) {
  const total = data.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          {type === "income" ? "Income Breakdown" : "Expense Breakdown"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((item) => {
          const config =
            transactionTypes[item.type as keyof typeof transactionTypes];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Icon = (Icons as any)[config.icon];
          const percentage = (item.total / total) * 100;

          return (
            <div key={item.type} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "p-1.5 rounded-full bg-muted",
                      type === "expense" ? "text-red-500" : "text-green-500"
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                  </div>
                  <span className="font-medium">{config.label}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    ₱{item.total.toLocaleString()}
                  </div>
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
                    : "[&>div]:bg-green-500"
                )}
              />
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
