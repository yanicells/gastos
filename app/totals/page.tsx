import { Suspense } from "react";
import {
  fetchAllTimeTotals,
  fetchCategoryBreakdown,
} from "@/lib/actions/analytics";
import { getAvailableYears } from "@/lib/queries/transactions";
import { Navbar } from "@/components/shared/navbar";
import { AuthCheck } from "@/components/shared/auth-check";
import { TotalsClient } from "@/components/totals/totals-client";
import { TotalsSkeleton } from "@/components/totals/skeletons";

async function TotalsSection() {
  const [totals, incomeBreakdown, expenseBreakdown, availableYears] =
    await Promise.all([
      fetchAllTimeTotals(),
      fetchCategoryBreakdown(undefined, undefined, "income"),
      fetchCategoryBreakdown(undefined, undefined, "expense"),
      getAvailableYears(),
    ]);

  return (
    <TotalsClient
      initialTotals={totals.data}
      initialIncomeBreakdown={incomeBreakdown.data}
      initialExpenseBreakdown={expenseBreakdown.data}
      availableYears={availableYears}
      fetchTotals={fetchAllTimeTotals}
      fetchBreakdown={fetchCategoryBreakdown}
    />
  );
}

export default function TotalsPage() {
  return (
    <div className="min-h-svh bg-background">
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>

      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<TotalsSkeleton />}>
          <TotalsSection />
        </Suspense>
      </main>
    </div>
  );
}
