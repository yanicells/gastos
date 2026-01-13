import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Summary table skeleton - simple full-width rows to indicate data loading.
 */
export function SummaryTableSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-30" />
            <Skeleton className="h-9 w-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Header-like skeleton */}
            <div className="flex gap-4 px-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Rows */}
            <div className="space-y-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>

            {/* Total Row */}
            <Skeleton className="h-12 w-full rounded-md opacity-50" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
