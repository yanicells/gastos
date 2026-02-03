import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton for SummaryStats - matches the 2x3 grid layout with header
 */
export function SummaryStatsSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="flex-1">
        {/* Stats cards - 2x3 grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 h-full">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col justify-center gap-2 p-4 rounded-xl border bg-card/50 h-full"
            >
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-md lg:h-10 lg:w-10" />
                <Skeleton className="h-4 w-16 lg:h-5 lg:w-24" />
              </div>
              <Skeleton className="h-8 w-28 lg:h-10 lg:w-40" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton for recent transactions table.
 */
export function RecentTransactionsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

/**
 * Dashboard page skeleton - matches layout of dashboard.
 */
export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Add Form Card - matching structure but simplified as it's static in page too, but good to have placeholder */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        {/* Summary Stats Card */}
        <SummaryStatsSkeleton />
      </div>

      {/* Recent Transactions Card */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-20" />
        </CardHeader>
        <CardContent>
          <RecentTransactionsSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}
