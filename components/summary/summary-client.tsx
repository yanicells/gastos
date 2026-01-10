"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { YearSelector } from "@/components/shared/year-selector";
import { MonthlyTable } from "@/components/summary/monthly-table";
import type {
  MonthlySummaryRow,
  YearlySummaryTotals,
} from "@/lib/types/analytics";

interface SummaryClientProps {
  initialData: MonthlySummaryRow[];
  initialTotals: YearlySummaryTotals;
  initialYear: number;
  fetchYearlySummary: (year: number) => Promise<{
    data: MonthlySummaryRow[];
    totals: YearlySummaryTotals;
    error: Error | null;
  }>;
}

export function SummaryClient({
  initialData,
  initialTotals,
  initialYear,
  fetchYearlySummary,
}: SummaryClientProps) {
  const [year, setYear] = useState(initialYear);
  const [data, setData] = useState(initialData);
  const [totals, setTotals] = useState(initialTotals);
  const [isPending, startTransition] = useTransition();

  const loadData = useCallback(
    (selectedYear: number) => {
      startTransition(async () => {
        const result = await fetchYearlySummary(selectedYear);
        if (!result.error) {
          setData(result.data);
          setTotals(result.totals);
        }
      });
    },
    [fetchYearlySummary]
  );

  useEffect(() => {
    if (year !== initialYear) {
      loadData(year);
    }
  }, [year, initialYear, loadData]);

  const handleRefresh = () => {
    loadData(year);
  };

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Yearly Summary</CardTitle>
            <div className="flex items-center gap-2">
              <YearSelector value={year} onChange={setYear} />
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
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <MonthlyTable data={data} totals={totals} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
