import type { CategoryBreakdown } from "@/lib/types/transaction";

/** Monthly summary row type */
export interface MonthlySummaryRow {
  month: number;
  expenses: Record<string, number>;
  income: Record<string, number>;
  totalExpenses: number;
  totalIncome: number;
  savings: number;
}

/** Yearly summary totals type */
export interface YearlySummaryTotals {
  expenses: Record<string, number>;
  income: Record<string, number>;
  totalExpenses: number;
  totalIncome: number;
  savings: number;
}

/** Stats for a period */
export interface PeriodStats {
  income: number;
  expenses: number;
  savings: number;
}

/** Rolling averages */
export interface RollingAverages {
  daily: PeriodStats;
  weekly: PeriodStats;
  monthly: PeriodStats;
}

/** Weekly breakdown inside a selected month */
export interface WeeklyBreakdown {
  weekNumber: number;
  label: string;
  startDate: string;
  endDate: string;
  totals: PeriodStats;
  incomeBreakdown: CategoryBreakdown[];
  expenseBreakdown: CategoryBreakdown[];
}

/** Monthly analytics payload including weekly breakdowns */
export interface MonthlyBreakdown {
  year: number;
  month: number;
  totals: PeriodStats;
  incomeBreakdown: CategoryBreakdown[];
  expenseBreakdown: CategoryBreakdown[];
  weekly: WeeklyBreakdown[];
}
