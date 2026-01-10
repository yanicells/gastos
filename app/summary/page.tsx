import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getYearlySummary } from "@/lib/queries/analytics";
import { SummaryClient } from "@/components/summary/summary-client";

/**
 * Server action to fetch yearly summary data.
 */
async function fetchYearlySummary(year: number) {
  "use server";
  return getYearlySummary(year);
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

  // Get current year and fetch initial data
  const currentYear = new Date().getFullYear();
  const { data, totals } = await getYearlySummary(currentYear);

  return (
    <SummaryClient
      initialData={data}
      initialTotals={totals}
      initialYear={currentYear}
      fetchYearlySummary={fetchYearlySummary}
    />
  );
}
