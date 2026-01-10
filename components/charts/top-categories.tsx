"use client";

import { transactionTypes } from "@/lib/data/types";
import type { CategoryBreakdown } from "@/lib/types/transaction";
import {
  GraduationCap,
  ShoppingCart,
  User,
  Package,
  MoreHorizontal,
  Utensils,
  School,
} from "lucide-react";

interface TopCategoriesProps {
  data: CategoryBreakdown[];
}

/** Icon map for transaction types */
const ICON_MAP: Record<string, React.ElementType> = {
  GraduationCap,
  ShoppingCart,
  User,
  Package,
  MoreHorizontal,
  Utensils,
  School,
};

/**
 * Format amount as Philippine Peso.
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Top spending categories with horizontal progress bars.
 */
export function TopCategories({ data }: TopCategoriesProps) {
  if (data.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No expense data available
      </div>
    );
  }

  const maxAmount = Math.max(...data.map((item) => item.total));

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const typeConfig =
          transactionTypes[item.type as keyof typeof transactionTypes];
        const Icon = ICON_MAP[typeConfig?.icon ?? "Package"] ?? Package;
        const percentage = (item.total / maxAmount) * 100;

        return (
          <div key={item.type} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm w-4">
                  {index + 1}.
                </span>
                <div
                  className="p-1.5 rounded-md"
                  style={{ backgroundColor: `${typeConfig?.color}20` }}
                >
                  <Icon
                    className="h-4 w-4"
                    style={{ color: typeConfig?.color }}
                  />
                </div>
                <span className="font-medium">
                  {typeConfig?.label ?? item.type}
                </span>
              </div>
              <span className="font-semibold tabular-nums">
                {formatCurrency(item.total)}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: typeConfig?.color ?? "#6b7280",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
