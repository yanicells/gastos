import { createClient } from "@/lib/supabase/server";
import { transactionTypes } from "@/lib/data/types";
import type { CategoryBreakdown } from "@/lib/types/transaction";
import type {
  MonthlySummaryRow,
  YearlySummaryTotals,
  PeriodStats,
  RollingAverages,
} from "@/lib/types/analytics";

/**
 * Get breakdown by transaction type for a date range.
 * Used for pie charts and category analysis.
 */
export async function getCategoryBreakdown(
  startDate?: string,
  endDate?: string,
  category?: "expense" | "income",
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
    (a, b) => b.total - a.total,
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
  endDate?: string,
): Promise<{ data: CategoryBreakdown[]; error: Error | null }> {
  const result = await getCategoryBreakdown(startDate, endDate, "expense");

  if (result.error) {
    return result;
  }

  return { data: result.data.slice(0, limit), error: null };
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
  month: number,
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
      `and(date.gte.${currentStart},date.lte.${currentEnd}),and(date.gte.${prevStart},date.lte.${prevEnd}),and(date.gte.${lastYearStart},date.lte.${lastYearEnd})`,
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

/**
 * Get current month totals (income, expenses, savings).
 */
export async function getCurrentMonthStats(): Promise<{
  data: PeriodStats;
  error: Error | null;
}> {
  const supabase = await createClient();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("transactions")
    .select("type, amount")
    .gte("date", startDate)
    .lte("date", endDate)
    .is("deleted_at", null);

  if (error) {
    return {
      data: { income: 0, expenses: 0, savings: 0 },
      error: new Error(error.message),
    };
  }

  let income = 0;
  let expenses = 0;

  for (const row of data ?? []) {
    const typeConfig =
      transactionTypes[row.type as keyof typeof transactionTypes];
    const amount = Number(row.amount);

    if (typeConfig?.category === "income") {
      income += amount;
    } else {
      expenses += amount;
    }
  }

  return {
    data: { income, expenses, savings: income - expenses },
    error: null,
  };
}

/**
 * Get rolling averages for a specific year (year-to-date if current year).
 * Returns avg per day, avg per week, avg per month based on that year's data.
 * @param year - The year to calculate averages for (defaults to current year)
 */
export async function getRollingAverages(year?: number): Promise<{
  data: RollingAverages;
  error: Error | null;
}> {
  const supabase = await createClient();

  const now = new Date();
  const targetYear = year ?? now.getFullYear();
  const isCurrentYear = targetYear === now.getFullYear();

  const startOfYear = `${targetYear}-01-01`;
  // For current year, use today; for past years, use Dec 31
  const endDate = isCurrentYear
    ? now.toISOString().split("T")[0]
    : `${targetYear}-12-31`;

  const { data, error } = await supabase
    .from("transactions")
    .select("type, amount")
    .gte("date", startOfYear)
    .lte("date", endDate)
    .is("deleted_at", null);

  if (error) {
    const zero = { income: 0, expenses: 0, savings: 0 };
    return {
      data: { daily: zero, weekly: zero, monthly: zero },
      error: new Error(error.message),
    };
  }

  // Calculate totals
  let totalIncome = 0;
  let totalExpenses = 0;

  for (const row of data ?? []) {
    const typeConfig =
      transactionTypes[row.type as keyof typeof transactionTypes];
    const amount = Number(row.amount);

    if (typeConfig?.category === "income") {
      totalIncome += amount;
    } else {
      totalExpenses += amount;
    }
  }

  const totalSavings = totalIncome - totalExpenses;

  // Calculate elapsed time periods for the year
  let daysDiff: number;
  let weeksDiff: number;
  let monthsDiff: number;

  if (isCurrentYear) {
    // Current year: calculate from Jan 1 to today
    const startDate = new Date(startOfYear);
    daysDiff = Math.max(
      1,
      Math.floor(
        (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      ) + 1,
    );
    weeksDiff = Math.max(1, Math.ceil(daysDiff / 7));
    monthsDiff = Math.max(1, now.getMonth() + 1);
  } else {
    // Past year: full year (365/366 days, 52 weeks, 12 months)
    const isLeapYear =
      (targetYear % 4 === 0 && targetYear % 100 !== 0) ||
      targetYear % 400 === 0;
    daysDiff = isLeapYear ? 366 : 365;
    weeksDiff = 52;
    monthsDiff = 12;
  }

  return {
    data: {
      daily: {
        income: totalIncome / daysDiff,
        expenses: totalExpenses / daysDiff,
        savings: totalSavings / daysDiff,
      },
      weekly: {
        income: totalIncome / weeksDiff,
        expenses: totalExpenses / weeksDiff,
        savings: totalSavings / weeksDiff,
      },
      monthly: {
        income: totalIncome / monthsDiff,
        expenses: totalExpenses / monthsDiff,
        savings: totalSavings / monthsDiff,
      },
    },
    error: null,
  };
}

/**
 * Get totals (income, expenses, savings) with optional year/month filtering.
 * - No params: all-time totals
 * - Year only: totals for that year
 * - Year + month: totals for that specific month
 */
export async function getAllTimeTotals(
  year?: number,
  month?: number,
): Promise<{
  data: PeriodStats;
  error: Error | null;
}> {
  const supabase = await createClient();

  let query = supabase
    .from("transactions")
    .select("type, amount")
    .is("deleted_at", null);

  // Apply year filter
  if (year) {
    const startDate = month
      ? `${year}-${String(month).padStart(2, "0")}-01`
      : `${year}-01-01`;
    const endDate = month
      ? new Date(year, month, 0).toISOString().split("T")[0]
      : `${year}-12-31`;

    query = query.gte("date", startDate).lte("date", endDate);
  }

  const { data, error } = await query;

  if (error) {
    return {
      data: { income: 0, expenses: 0, savings: 0 },
      error: new Error(error.message),
    };
  }

  let income = 0;
  let expenses = 0;

  for (const row of data ?? []) {
    const typeConfig =
      transactionTypes[row.type as keyof typeof transactionTypes];
    const amount = Number(row.amount);

    if (typeConfig?.category === "income") {
      income += amount;
    } else {
      expenses += amount;
    }
  }

  return {
    data: { income, expenses, savings: income - expenses },
    error: null,
  };
}

/**
 * Get total expenses for today.
 */
export async function getTodaySpend(): Promise<{
  data: number;
  error: Error | null;
}> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("transactions")
    .select("type, amount")
    .eq("date", today)
    .is("deleted_at", null);

  if (error) {
    return { data: 0, error: new Error(error.message) };
  }

  let todaySpend = 0;

  for (const row of data ?? []) {
    const typeConfig =
      transactionTypes[row.type as keyof typeof transactionTypes];

    // Only count expenses
    if (typeConfig?.category === "expense") {
      todaySpend += Number(row.amount);
    }
  }

  return { data: todaySpend, error: null };
}

/**
 * Get total expenses for the current week (Monday to today).
 * Week starts on Monday.
 */
export async function getWeeklyExpenses(): Promise<{
  data: number;
  error: Error | null;
}> {
  const supabase = await createClient();
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // Calculate Monday of current week
  // getDay() returns 0 for Sunday, 1 for Monday, etc.
  const dayOfWeek = now.getDay();
  // If Sunday (0), we need to go back 6 days to get to Monday
  // If Monday (1), we need to go back 0 days
  // Otherwise, go back (dayOfWeek - 1) days
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysToSubtract);
  const mondayStr = monday.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("transactions")
    .select("type, amount")
    .gte("date", mondayStr)
    .lte("date", today)
    .is("deleted_at", null);

  if (error) {
    return { data: 0, error: new Error(error.message) };
  }

  let weeklyExpenses = 0;

  for (const row of data ?? []) {
    const typeConfig =
      transactionTypes[row.type as keyof typeof transactionTypes];

    // Only count expenses
    if (typeConfig?.category === "expense") {
      weeklyExpenses += Number(row.amount);
    }
  }

  return { data: weeklyExpenses, error: null };
}

/**
 * Get weekly savings target (this month income / number of weeks in the month).
 */
export async function getWeeklySavings(): Promise<{
  data: number;
  error: Error | null;
}> {
  const supabase = await createClient();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).toISOString().split("T")[0];

  // Calculate number of weeks in the month
  // Get the number of days in the month
  const daysInMonth = new Date(year, month, 0).getDate();
  // A month typically has 4-5 weeks. We'll use ceil(daysInMonth / 7)
  const weeksInMonth = Math.ceil(daysInMonth / 7);

  const { data, error } = await supabase
    .from("transactions")
    .select("type, amount")
    .gte("date", startDate)
    .lte("date", endDate)
    .is("deleted_at", null);

  if (error) {
    return { data: 0, error: new Error(error.message) };
  }

  let monthlyIncome = 0;

  for (const row of data ?? []) {
    const typeConfig =
      transactionTypes[row.type as keyof typeof transactionTypes];

    // Only count income
    if (typeConfig?.category === "income") {
      monthlyIncome += Number(row.amount);
    }
  }

  // Weekly savings = monthly income / weeks in month
  const weeklySavings = monthlyIncome / weeksInMonth;

  return { data: weeklySavings, error: null };
}
