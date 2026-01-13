import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getYearlySummary } from "@/lib/queries/analytics";
import { getAvailableYears } from "@/lib/queries/transactions";
import { fetchYearlySummary } from "@/lib/actions/analytics";
import { SummaryClient } from "@/components/summary/summary-client";
import { Navbar } from "@/components/shared/navbar";
import { SummaryTableSkeleton } from "@/components/shared/skeletons";

/**
 * Skeleton for summary table content.
 */
function SummaryContentSkeleton() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <SummaryTableSkeleton />
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
