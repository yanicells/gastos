"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Transaction table skeleton - simple full-width rows.
 */
import { TransactionFilters, type FilterState } from "./transaction-filters";

/**
 * Transaction table skeleton - simple full-width rows.
 */
export function TransactionTableSkeleton({ rows = 5 }: { rows?: number }) {
  const defaultFilters: FilterState = {
    category: "all",
    type: "all",
    startDate: undefined,
    endDate: undefined,
    search: "",
  };

  return (
    <div className="space-y-6">
      {/* Filters - Rendered immediately */}
      <div className="pointer-events-none opacity-80">
        <TransactionFilters filters={defaultFilters} onChange={() => {}} />
      </div>

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Transactions page skeleton - full page with filters.
 */
export function TransactionsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters row */}
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 flex-1 min-w-48" />
          </div>
          <TransactionTableSkeleton rows={12} />
        </CardContent>
      </Card>
    </div>
  );
}
