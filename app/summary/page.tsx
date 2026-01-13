import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getYearlySummary } from "@/lib/queries/analytics";
import { getAvailableYears } from "@/lib/queries/transactions";
import { fetchYearlySummary } from "@/lib/actions/analytics";
import { SummaryClient } from "@/components/summary/summary-client";
import { Navbar } from "@/components/shared/navbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton for summary table content.
 */
function SummaryContentSkeleton() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-10" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 overflow-x-auto">
              {/* Header row */}
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24 shrink-0" />
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-16 shrink-0" />
                ))}
                <Skeleton className="h-8 w-20 shrink-0" />
              </div>
              {/* Data rows */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex gap-2">
                  <Skeleton className="h-6 w-24 shrink-0" />
                  {Array.from({ length: 12 }).map((_, j) => (
                    <Skeleton key={j} className="h-6 w-16 shrink-0" />
                  ))}
                  <Skeleton className="h-6 w-20 shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Async component for summary content.
 */
async function SummarySection() {
  const currentYear = new Date().getFullYear();
  const [{ data, totals }, availableYears] = await Promise.all([
    getYearlySummary(currentYear),
    getAvailableYears(),
  ]);

  return (
    <SummaryClient
      initialData={data}
      initialTotals={totals}
      initialYear={currentYear}
      availableYears={availableYears}
      fetchYearlySummary={fetchYearlySummary}
    />
  );
}

/**
 * Summary page - Excel-style monthly overview.
 */
export default async function SummaryPage() {
  const supabase = await createClient();

  // Check auth
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    redirect("/auth/login");
  }

  return (
    <Suspense fallback={<SummaryContentSkeleton />}>
      <SummarySection />
    </Suspense>
  );
}
