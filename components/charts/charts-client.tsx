"use client";

import { useState, useEffect, useTransition, useCallback, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { YearSelector } from "@/components/shared/year-selector";
import { MonthlyBarChart } from "@/components/charts/monthly-bar-chart";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { TopCategories } from "@/components/charts/top-categories";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import { ComparisonCards } from "@/components/charts/comparison-cards";
import { AveragesSummary } from "@/components/charts/averages-summary";
import type { CategoryBreakdown } from "@/lib/types/transaction";
import type { RollingAverages } from "@/lib/types/analytics";

interface ChartsClientProps {
  initialYear: number;
  initialMonth: number;
  availableYears: number[];
  initialMonthlyData: { month: number; income: number; expense: number }[];
  initialCategoryData: CategoryBreakdown[];
  initialTopCategories: CategoryBreakdown[];
  initialComparison: {
    currentMonth: { income: number; expense: number };
    previousMonth: { income: number; expense: number };
    sameMonthLastYear: { income: number; expense: number };
  };
  initialAverages: RollingAverages;
  fetchMonthlyTrend: (year: number) => Promise<{
    data: { month: number; income: number; expense: number }[];
    error: Error | null;
  }>;
  fetchCategoryBreakdown: (
    startDate?: string,
    endDate?: string,
    category?: "expense" | "income"
  ) => Promise<{ data: CategoryBreakdown[]; error: Error | null }>;
  fetchTopCategories: (
    limit?: number,
    startDate?: string,
    endDate?: string
  ) => Promise<{ data: CategoryBreakdown[]; error: Error | null }>;
  fetchComparisonData: (
    year: number,
    month: number
  ) => Promise<{
    currentMonth: { income: number; expense: number };
    previousMonth: { income: number; expense: number };
    sameMonthLastYear: { income: number; expense: number };
    error: Error | null;
  }>;
  fetchRollingAverages: (year?: number) => Promise<{
    data: RollingAverages;
    error: Error | null;
  }>;
}

export function ChartsClient({
  initialYear,
  initialMonth,
  availableYears,
  initialMonthlyData,
  initialCategoryData,
  initialTopCategories,
  initialComparison,
  initialAverages,
  fetchMonthlyTrend,
  fetchCategoryBreakdown,
  fetchTopCategories,
  fetchComparisonData,
  fetchRollingAverages,
}: ChartsClientProps) {
  const [year, setYear] = useState(initialYear);
  const [monthlyData, setMonthlyData] = useState(initialMonthlyData);
  const [categoryData, setCategoryData] = useState(initialCategoryData);
  const [topCategories, setTopCategories] = useState(initialTopCategories);
  const [comparison, setComparison] = useState(initialComparison);
  const [averages, setAverages] = useState(initialAverages);
  const [isPending, startTransition] = useTransition();

  const loadData = useCallback(
    (selectedYear: number) => {
      startTransition(async () => {
        const startDate = `${selectedYear}-01-01`;
        const endDate = `${selectedYear}-12-31`;

        const [monthly, category, top, comp, avg] = await Promise.all([
          fetchMonthlyTrend(selectedYear),
          fetchCategoryBreakdown(startDate, endDate, "expense"),
          fetchTopCategories(5, startDate, endDate),
          fetchComparisonData(selectedYear, initialMonth),
          fetchRollingAverages(selectedYear),
        ]);

        if (!monthly.error) setMonthlyData(monthly.data);
        if (!category.error) setCategoryData(category.data);
        if (!top.error) setTopCategories(top.data);
        if (!comp.error) {
          setComparison({
            currentMonth: comp.currentMonth,
            previousMonth: comp.previousMonth,
            sameMonthLastYear: comp.sameMonthLastYear,
          });
        }
        if (!avg.error) setAverages(avg.data);
      });
    },
    [
      fetchMonthlyTrend,
      fetchCategoryBreakdown,
      fetchTopCategories,
      fetchComparisonData,
      fetchRollingAverages,
      initialMonth,
    ]
  );

  // Track if this is the first render to avoid double-fetching
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip initial load (data already fetched on server)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    loadData(year);
  }, [year, loadData]);

  const handleRefresh = () => {
    loadData(year);
  };

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Analytics Overview</h2>
          <div className="flex items-center gap-2">
            <YearSelector
              value={year}
              onChange={setYear}
              years={availableYears}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isPending}
            >
              <RefreshCw
                className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
          {/* Comparison Cards */}
          <ComparisonCards
            currentMonth={comparison.currentMonth}
            previousMonth={comparison.previousMonth}
            sameMonthLastYear={comparison.sameMonthLastYear}
          />

          {/* Averages Summary */}
          <AveragesSummary averages={averages} />

          {/* Monthly Bar Chart (Hero) */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Monthly Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyBarChart data={monthlyData} />
            </CardContent>
          </Card>

          {/* Pie Chart + Top Categories Row */}
          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryPieChart data={categoryData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Spending Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <TopCategories data={topCategories} />
              </CardContent>
            </Card>
          </div>

          {/* Trend Line Chart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Monthly Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendLineChart data={monthlyData} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
