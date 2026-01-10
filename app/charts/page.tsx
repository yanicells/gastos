import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getMonthlyTrend,
  getCategoryBreakdown,
  getTopCategories,
  getComparisonData,
} from "@/lib/queries/analytics";
import { ChartsClient } from "@/components/charts/charts-client";

/**
 * Server action to fetch monthly trend data.
 */
async function fetchMonthlyTrend(year: number) {
  "use server";
  return getMonthlyTrend(year);
}

/**
 * Server action to fetch category breakdown.
 */
async function fetchCategoryBreakdown(
  startDate?: string,
  endDate?: string,
  category?: "expense" | "income"
) {
  "use server";
  return getCategoryBreakdown(startDate, endDate, category);
}

/**
 * Server action to fetch top categories.
 */
async function fetchTopCategories(
  limit?: number,
  startDate?: string,
  endDate?: string
) {
  "use server";
  return getTopCategories(limit, startDate, endDate);
}

/**
 * Server action to fetch comparison data.
 */
async function fetchComparisonData(year: number, month: number) {
  "use server";
  return getComparisonData(year, month);
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

  // Get current year and month
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Fetch initial data
  const startDate = `${currentYear}-01-01`;
  const endDate = `${currentYear}-12-31`;

  const [monthlyData, categoryData, topCategoriesData, comparisonData] =
    await Promise.all([
      getMonthlyTrend(currentYear),
      getCategoryBreakdown(startDate, endDate, "expense"),
      getTopCategories(5, startDate, endDate),
      getComparisonData(currentYear, currentMonth),
    ]);

  return (
    <ChartsClient
      initialYear={currentYear}
      initialMonth={currentMonth}
      initialMonthlyData={monthlyData.data}
      initialCategoryData={categoryData.data}
      initialTopCategories={topCategoriesData.data}
      initialComparison={{
        currentMonth: comparisonData.currentMonth,
        previousMonth: comparisonData.previousMonth,
        sameMonthLastYear: comparisonData.sameMonthLastYear,
      }}
      fetchMonthlyTrend={fetchMonthlyTrend}
      fetchCategoryBreakdown={fetchCategoryBreakdown}
      fetchTopCategories={fetchTopCategories}
      fetchComparisonData={fetchComparisonData}
    />
  );
}
