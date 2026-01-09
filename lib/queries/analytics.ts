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
