import { Suspense } from "react";
import { getYearlySummary } from "@/lib/queries/analytics";
import { getAvailableYears } from "@/lib/queries/transactions";
import { fetchYearlySummary } from "@/lib/actions/analytics";
import { SummaryClient } from "@/components/summary/summary-client";
import { Navbar } from "@/components/shared/navbar";
import { SummaryTableSkeleton } from "@/components/summary/skeletons";
import { AuthCheck } from "@/components/shared/auth-check";

/**
 * Skeleton for summary table content.
 */

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
export default function SummaryPage() {
  return (
    <div className="min-h-svh bg-background">
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>

      {/* Header */}
      <Navbar />

      <Suspense fallback={<SummaryTableSkeleton />}>
        <SummarySection />
      </Suspense>
    </div>
  );
}
