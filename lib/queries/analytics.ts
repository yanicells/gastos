import { createClient } from "@/lib/supabase/server";
import { transactionTypes } from "@/lib/data/types";
import type { CategoryBreakdown } from "@/lib/types/transaction";

/**
 * Get breakdown by transaction type for a date range.
 * Used for pie charts and category analysis.
 */
export async function getCategoryBreakdown(
  startDate?: string,
  endDate?: string,
  category?: "expense" | "income"
): Promise<{ data: CategoryBreakdown[]; error: Error | null }> {
  const supabase = await createClient();

  let query = supabase
    .from("transactions")
    .select("type, amount")
    .is("deleted_at", null);

  if (startDate) {
    query = query.gte("date", startDate);
  }
  if (endDate) {
    query = query.lte("date", endDate);
  }

  // Filter by category if specified
  if (category) {
    const categoryTypes = Object.entries(transactionTypes)
      .filter(([, config]) => config.category === category)
      .map(([key]) => key);
    query = query.in("type", categoryTypes);
  }

  const { data, error } = await query;

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  // Aggregate by type
  const aggregated = new Map<string, CategoryBreakdown>();

  for (const row of data ?? []) {
    if (aggregated.has(row.type)) {
      const existing = aggregated.get(row.type)!;
      existing.total += Number(row.amount);
      existing.count += 1;
    } else {
      aggregated.set(row.type, {
        type: row.type,
        total: Number(row.amount),
        count: 1,
      });
    }
  }

  // Sort by total descending
  const result = Array.from(aggregated.values()).sort(
    (a, b) => b.total - a.total
  );

  return { data: result, error: null };
}

/**
 * Get monthly income vs expense totals for a year.
 * Used for bar charts showing monthly trends.
 */
export async function getMonthlyTrend(year: number): Promise<{
  data: { month: number; income: number; expense: number }[];
  error: Error | null;
}> {
  const supabase = await createClient();

  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const { data, error } = await supabase
    .from("transactions")
    .select("date, type, amount")
    .gte("date", startDate)
    .lte("date", endDate)
    .is("deleted_at", null);

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  // Initialize all 12 months
  const monthly = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    income: 0,
    expense: 0,
  }));

  for (const row of data ?? []) {
    const month = new Date(row.date).getMonth();
    const typeConfig =
      transactionTypes[row.type as keyof typeof transactionTypes];

    if (typeConfig?.category === "income") {
      monthly[month].income += Number(row.amount);
    } else {
      monthly[month].expense += Number(row.amount);
    }
  }

  return { data: monthly, error: null };
}

/**
 * Get top spending categories by total amount.
 */
export async function getTopCategories(
  limit: number = 5,
  startDate?: string,
  endDate?: string
): Promise<{ data: CategoryBreakdown[]; error: Error | null }> {
  const result = await getCategoryBreakdown(startDate, endDate, "expense");

  if (result.error) {
    return result;
  }

  return { data: result.data.slice(0, limit), error: null };
}

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

/**
 * Get yearly summary grouped by month and expense/income groups.
 * Used for Excel-style summary table.
 */
export async function getYearlySummary(year: number): Promise<{
  data: MonthlySummaryRow[];
  totals: YearlySummaryTotals;
  error: Error | null;
}> {
  const supabase = await createClient();

  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const { data, error } = await supabase
    .from("transactions")
    .select("date, type, amount")
    .gte("date", startDate)
    .lte("date", endDate)
    .is("deleted_at", null);

  if (error) {
    return {
      data: [],
      totals: {
        expenses: {},
        income: {},
        totalExpenses: 0,
        totalIncome: 0,
        savings: 0,
      },
      error: new Error(error.message),
    };
  }

  // Initialize all 12 months with empty group sums
  const monthly: MonthlySummaryRow[] = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    expenses: {},
    income: {},
    totalExpenses: 0,
    totalIncome: 0,
    savings: 0,
  }));

  // Totals accumulator
  const totals: YearlySummaryTotals = {
    expenses: {},
    income: {},
    totalExpenses: 0,
    totalIncome: 0,
    savings: 0,
  };

  for (const row of data ?? []) {
    const monthIndex = new Date(row.date).getMonth();
    const typeConfig =
      transactionTypes[row.type as keyof typeof transactionTypes];
    const amount = Number(row.amount);

    if (!typeConfig) continue;

    const group = typeConfig.group;
    const monthRow = monthly[monthIndex];

    if (typeConfig.category === "expense") {
      // Add to month's expense group
      monthRow.expenses[group] = (monthRow.expenses[group] ?? 0) + amount;
      monthRow.totalExpenses += amount;

      // Add to totals
      totals.expenses[group] = (totals.expenses[group] ?? 0) + amount;
      totals.totalExpenses += amount;
    } else {
      // Add to month's income group
      monthRow.income[group] = (monthRow.income[group] ?? 0) + amount;
      monthRow.totalIncome += amount;

      // Add to totals
      totals.income[group] = (totals.income[group] ?? 0) + amount;
      totals.totalIncome += amount;
    }
  }

  // Calculate savings for each month and totals
  for (const monthRow of monthly) {
    monthRow.savings = monthRow.totalIncome - monthRow.totalExpenses;
  }
  totals.savings = totals.totalIncome - totals.totalExpenses;

  return { data: monthly, totals, error: null };
}

/**
 * Get comparison data for MoM and YoY analytics.
 */
export async function getComparisonData(
  year: number,
  month: number
): Promise<{
  currentMonth: { income: number; expense: number };
  previousMonth: { income: number; expense: number };
  sameMonthLastYear: { income: number; expense: number };
  error: Error | null;
}> {
  const supabase = await createClient();

  // Current month range
  const currentStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const currentEnd = new Date(year, month, 0).toISOString().split("T")[0];

  // Previous month range
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevStart = `${prevYear}-${String(prevMonth).padStart(2, "0")}-01`;
  const prevEnd = new Date(prevYear, prevMonth, 0).toISOString().split("T")[0];

  // Same month last year range
  const lastYearStart = `${year - 1}-${String(month).padStart(2, "0")}-01`;
  const lastYearEnd = new Date(year - 1, month, 0).toISOString().split("T")[0];

  // Fetch all relevant transactions in one query
  const { data, error } = await supabase
    .from("transactions")
    .select("date, type, amount")
    .or(
      `and(date.gte.${currentStart},date.lte.${currentEnd}),and(date.gte.${prevStart},date.lte.${prevEnd}),and(date.gte.${lastYearStart},date.lte.${lastYearEnd})`
    )
    .is("deleted_at", null);

  if (error) {
    return {
      currentMonth: { income: 0, expense: 0 },
      previousMonth: { income: 0, expense: 0 },
      sameMonthLastYear: { income: 0, expense: 0 },
      error: new Error(error.message),
    };
  }

  const result = {
    currentMonth: { income: 0, expense: 0 },
    previousMonth: { income: 0, expense: 0 },
    sameMonthLastYear: { income: 0, expense: 0 },
  };

  for (const row of data ?? []) {
    const date = row.date;
    const typeConfig =
      transactionTypes[row.type as keyof typeof transactionTypes];
    const amount = Number(row.amount);
    const isIncome = typeConfig?.category === "income";

    if (date >= currentStart && date <= currentEnd) {
      if (isIncome) result.currentMonth.income += amount;
      else result.currentMonth.expense += amount;
    } else if (date >= prevStart && date <= prevEnd) {
      if (isIncome) result.previousMonth.income += amount;
      else result.previousMonth.expense += amount;
    } else if (date >= lastYearStart && date <= lastYearEnd) {
      if (isIncome) result.sameMonthLastYear.income += amount;
      else result.sameMonthLastYear.expense += amount;
    }
  }

  return { ...result, error: null };
}
