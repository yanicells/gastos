"use client";

import { useState, useTransition } from "react";
import { RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YearSelector } from "@/components/shared/year-selector";
import { MonthSelector } from "@/components/shared/month-selector";
import { TotalsCards } from "@/components/totals/totals-cards";
import { CategoryBreakdownList } from "@/components/totals/category-breakdown-list";
import { TotalsSkeleton } from "@/components/totals/skeletons";
import type { PeriodStats } from "@/lib/types/analytics";
import type { CategoryBreakdown } from "@/lib/types/transaction";

interface TotalsClientProps {
  initialTotals: PeriodStats;
  initialIncomeBreakdown: CategoryBreakdown[];
  initialExpenseBreakdown: CategoryBreakdown[];
  availableYears: number[];
  fetchTotals: (
    year?: number,
    month?: number
  ) => Promise<{ data: PeriodStats; error: Error | null }>;
  fetchBreakdown: (
    startDate?: string,
    endDate?: string,
    category?: "income" | "expense"
  ) => Promise<{ data: CategoryBreakdown[]; error: Error | null }>;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function TotalsClient({
  initialTotals,
  initialIncomeBreakdown,
  initialExpenseBreakdown,
  availableYears,
  fetchTotals,
  fetchBreakdown,
}: TotalsClientProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [totals, setTotals] = useState(initialTotals);
  const [incomeBreakdown, setIncomeBreakdown] = useState(
    initialIncomeBreakdown
  );
  const [expenseBreakdown, setExpenseBreakdown] = useState(
    initialExpenseBreakdown
  );
  const [isPending, startTransition] = useTransition();

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setSelectedMonth(null); // Reset month when year changes
    refreshData(year, null);
  };

  const handleMonthChange = (month: number | null) => {
    setSelectedMonth(month);
    if (selectedYear) {
      refreshData(selectedYear, month);
    }
  };

  const handleReset = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
    refreshData(null, null);
  };

  const refreshData = (year: number | null, month: number | null) => {
    startTransition(async () => {
      // Calculate date range for breakdown queries
      let startDate: string | undefined;
      let endDate: string | undefined;

      if (year) {
        if (month) {
          startDate = `${year}-${String(month).padStart(2, "0")}-01`;
          endDate = new Date(year, month, 0).toISOString().split("T")[0];
        } else {
          startDate = `${year}-01-01`;
          endDate = `${year}-12-31`;
        }
      }

      const [totalsResult, incomeResult, expenseResult] = await Promise.all([
        fetchTotals(year ?? undefined, month ?? undefined),
        fetchBreakdown(startDate, endDate, "income"),
        fetchBreakdown(startDate, endDate, "expense"),
      ]);

      setTotals(totalsResult.data);
      setIncomeBreakdown(incomeResult.data);
      setExpenseBreakdown(expenseResult.data);
    });
  };

  // Build the title based on selection
  const getTitle = () => {
    if (!selectedYear) return "All-time Totals";
    if (selectedMonth)
      return `${MONTHS[selectedMonth - 1]} ${selectedYear} Totals`;
    return `${selectedYear} Totals`;
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">{getTitle()}</h1>
        <div className="flex items-center gap-2">
          {selectedYear && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              All Time
            </Button>
          )}
          <YearSelector
            value={selectedYear ?? availableYears[0]}
            onChange={handleYearChange}
            years={availableYears}
          />
          <MonthSelector
            value={selectedMonth}
            onChange={handleMonthChange}
            disabled={!selectedYear}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => refreshData(selectedYear, selectedMonth)}
            disabled={isPending}
          >
            <RefreshCw
              className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Content */}
      {isPending ? (
        <TotalsSkeleton />
      ) : (
        <div className="space-y-8">
          <TotalsCards
            income={totals.income}
            expenses={totals.expenses}
            savings={totals.savings}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <CategoryBreakdownList data={incomeBreakdown} type="income" />
            <CategoryBreakdownList data={expenseBreakdown} type="expense" />
          </div>
        </div>
      )}
    </div>
  );
}
