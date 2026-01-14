import { Suspense } from "react";
import {
  fetchAllTimeTotals,
  fetchCategoryBreakdown,
} from "@/lib/actions/analytics";
import { Navbar } from "@/components/shared/navbar";
import { AuthCheck } from "@/components/shared/auth-check";
import { TotalsCards } from "@/components/totals/totals-cards";
import { CategoryBreakdownList } from "@/components/totals/category-breakdown-list";
import { TotalsSkeleton } from "@/components/totals/skeletons";

async function TotalsSection() {
  const [totals, incomeBreakdown, expenseBreakdown] = await Promise.all([
    fetchAllTimeTotals(),
    fetchCategoryBreakdown(undefined, undefined, "income"),
    fetchCategoryBreakdown(undefined, undefined, "expense"),
  ]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">All-time Totals</h1>

      <TotalsCards
        income={totals.data.income}
        expenses={totals.data.expenses}
        savings={totals.data.savings}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <CategoryBreakdownList data={incomeBreakdown.data} type="income" />
        <CategoryBreakdownList data={expenseBreakdown.data} type="expense" />
      </div>
    </div>
  );
}

export default function TotalsPage() {
  return (
    <div className="min-h-svh bg-background">
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>

      <Navbar />

      <Suspense fallback={<TotalsSkeleton />}>
        <TotalsSection />
      </Suspense>
    </div>
  );
}
