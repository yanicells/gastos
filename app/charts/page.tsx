import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getMonthlyTrend,
  getCategoryBreakdown,
  getTopCategories,
  getComparisonData,
  getRollingAverages,
} from "@/lib/queries/analytics";
import { getAvailableYears } from "@/lib/queries/transactions";
import {
  fetchMonthlyTrend,
  fetchCategoryBreakdown,
  fetchTopCategories,
  fetchComparisonData,
  fetchRollingAverages,
} from "@/lib/actions/analytics";
import { ChartsClient } from "@/components/charts/charts-client";
import { Navbar } from "@/components/shared/navbar";
import { ChartsSkeleton } from "@/components/shared/skeletons";

/**
 * Async component for charts content.
 */
async function ChartsSection() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const startDate = `${currentYear}-01-01`;
  const endDate = `${currentYear}-12-31`;

  const [
    monthlyData,
    categoryData,
    topCategoriesData,
    comparisonData,
    averagesData,
    availableYears,
  ] = await Promise.all([
    getMonthlyTrend(currentYear),
    getCategoryBreakdown(startDate, endDate, "expense"),
    getTopCategories(5, startDate, endDate),
    getComparisonData(currentYear, currentMonth),
    getRollingAverages(currentYear),
    getAvailableYears(),
  ]);

  return (
    <ChartsClient
      initialYear={currentYear}
      initialMonth={currentMonth}
      availableYears={availableYears}
      initialMonthlyData={monthlyData.data}
      initialCategoryData={categoryData.data}
      initialTopCategories={topCategoriesData.data}
      initialComparison={{
        currentMonth: comparisonData.currentMonth,
        previousMonth: comparisonData.previousMonth,
        sameMonthLastYear: comparisonData.sameMonthLastYear,
      }}
      initialAverages={averagesData.data}
      fetchMonthlyTrend={fetchMonthlyTrend}
      fetchCategoryBreakdown={fetchCategoryBreakdown}
      fetchTopCategories={fetchTopCategories}
      fetchComparisonData={fetchComparisonData}
      fetchRollingAverages={fetchRollingAverages}
    />
  );
}

/**
 * Charts skeleton wrapper with navbar.
 */
function ChartsSkeletonWithNav() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <ChartsSkeleton />
    </div>
  );
}

/**
 * Charts page - Analytics dashboard with visualizations.
 */
export default async function ChartsPage() {
  const supabase = await createClient();

  // Check auth
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    redirect("/auth/login");
  }

  return (
    <Suspense fallback={<ChartsSkeletonWithNav />}>
      <ChartsSection />
    </Suspense>
  );
}
