import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getMonthlyTrend,
  getCategoryBreakdown,
  getTopCategories,
  getComparisonData,
} from "@/lib/queries/analytics";
import {
  fetchMonthlyTrend,
  fetchCategoryBreakdown,
  fetchTopCategories,
  fetchComparisonData,
} from "@/lib/actions/analytics";
import { ChartsClient } from "@/components/charts/charts-client";

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
