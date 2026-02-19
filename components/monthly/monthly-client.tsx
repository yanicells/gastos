"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YearSelector } from "@/components/shared/year-selector";
import { MonthSelector } from "@/components/shared/month-selector";
import { MonthlyCards } from "@/components/monthly/monthly-cards";
import { WeeklyBreakdownSection } from "@/components/monthly/weekly-breakdown";
import { CategoryBreakdownList } from "@/components/totals/category-breakdown-list";
import type { MonthlyBreakdown } from "@/lib/types/analytics";

interface MonthlyClientProps {
  initialYear: number;
  initialMonth: number;
  initialData: MonthlyBreakdown;
  availableYears: number[];
  fetchMonthlyBreakdown: (
    year: number,
    month: number,
  ) => Promise<{ data: MonthlyBreakdown; error: Error | null }>;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function MonthlyClient({
  initialYear,
  initialMonth,
  initialData,
  availableYears,
  fetchMonthlyBreakdown,
}: MonthlyClientProps) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  const loadData = (selectedYear: number, selectedMonth: number) => {
    startTransition(async () => {
      const result = await fetchMonthlyBreakdown(selectedYear, selectedMonth);
      if (!result.error) {
        setData(result.data);
      }
    });
  };

  const handleYearChange = (selectedYear: number) => {
    setYear(selectedYear);
    loadData(selectedYear, month);
  };

  const handleMonthChange = (selectedMonth: number | null) => {
    if (!selectedMonth) return;
    setMonth(selectedMonth);
    loadData(year, selectedMonth);
  };

  const title = `${MONTHS[month - 1]} ${year} Breakdown`;

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <div className="flex items-center gap-2">
            <YearSelector
              value={year}
              onChange={handleYearChange}
              years={availableYears}
            />
            <MonthSelector
              value={month}
              onChange={handleMonthChange}
              allowClear={false}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => loadData(year, month)}
              disabled={isPending}
            >
              <RefreshCw
                className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        <div
          className={`space-y-8 ${
            isPending ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Monthly Overview</h2>
            <MonthlyCards
              income={data.totals.income}
              expenses={data.totals.expenses}
              savings={data.totals.savings}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <CategoryBreakdownList
                data={data.incomeBreakdown}
                type="income"
              />
              <CategoryBreakdownList
                data={data.expenseBreakdown}
                type="expense"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Weekly Breakdown</h2>
            <WeeklyBreakdownSection weeks={data.weekly} />
          </section>
        </div>
      </div>
    </main>
  );
}
