import { Suspense } from "react";
import { getMonthlyBreakdown } from "@/lib/queries/analytics";
import { getAvailableYears } from "@/lib/queries/transactions";
import { fetchMonthlyBreakdown } from "@/lib/actions/analytics";
import { Navbar } from "@/components/shared/navbar";
import { AuthCheck } from "@/components/shared/auth-check";
import { MonthlyClient } from "@/components/monthly/monthly-client";
import { MonthlySkeleton } from "@/components/monthly/skeletons";

async function MonthlySection() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [breakdown, availableYears] = await Promise.all([
    getMonthlyBreakdown(currentYear, currentMonth),
    getAvailableYears(),
  ]);

  return (
    <MonthlyClient
      initialYear={currentYear}
      initialMonth={currentMonth}
      initialData={breakdown.data}
      availableYears={availableYears}
      fetchMonthlyBreakdown={fetchMonthlyBreakdown}
    />
  );
}

export default function MonthlyPage() {
  return (
    <div className="min-h-svh bg-background">
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>

      <Navbar />

      <Suspense fallback={<MonthlySkeleton />}>
        <MonthlySection />
      </Suspense>
    </div>
  );
}
