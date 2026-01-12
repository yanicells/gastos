import { createClient } from "@/lib/supabase/server";
import { transactionTypes } from "@/lib/data/types";
import type {
  Transaction,
  TransactionFilters,
  MonthlyTotal,
} from "@/lib/types/transaction";

/**
 * Get transactions with optional filters and pagination.
 */
export async function getTransactions(
  filters: TransactionFilters = {}
): Promise<{ data: Transaction[]; error: Error | null }> {
  const supabase = await createClient();

  const {
    startDate,
    endDate,
    types,
    category,
    search,
    limit = 50,
    offset = 0,
    includeDeleted = false,
  } = filters;

  let query = supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  // Soft delete filter
  if (!includeDeleted) {
    query = query.is("deleted_at", null);
  }

  // Date range filters
  if (startDate) {
    query = query.gte("date", startDate);
  }
  if (endDate) {
    query = query.lte("date", endDate);
  }

  // Type filters
  if (types && types.length > 0) {
    query = query.in("type", types);
  }

  // Category filter (expand to all types in that category)
  if (category && !types) {
    const categoryTypes = Object.entries(transactionTypes)
      .filter(([, config]) => config.category === category)
      .map(([key]) => key);
    query = query.in("type", categoryTypes);
  }

  // Search in notes
  if (search) {
    query = query.ilike("notes", `%${search}%`);
  }

  const { data, error } = await query;

  return {
    data: (data as Transaction[]) ?? [],
    error: error ? new Error(error.message) : null,
  };
}

/**
 * Get a single transaction by ID.
 */
export async function getTransactionById(
  id: string
): Promise<{ data: Transaction | null; error: Error | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  return {
    data: data as Transaction | null,
    error: error ? new Error(error.message) : null,
  };
}

/**
 * Get all transactions for a specific month.
 */
export async function getTransactionsByMonth(
  year: number,
  month: number
): Promise<{ data: Transaction[]; error: Error | null }> {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).toISOString().split("T")[0]; // Last day of month

  return getTransactions({ startDate, endDate, limit: 1000 });
}

/**
 * Get monthly totals aggregated by type for a given year.
 * Used for the summary table view.
 */
export async function getMonthlyTotals(
  year: number
): Promise<{ data: MonthlyTotal[]; error: Error | null }> {
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

  // Aggregate in JS (Supabase doesn't support GROUP BY in select)
  const aggregated = new Map<string, MonthlyTotal>();

  for (const row of data ?? []) {
    const month = new Date(row.date).getMonth() + 1;
    const key = `${year}-${month}-${row.type}`;

    if (aggregated.has(key)) {
      const existing = aggregated.get(key)!;
      existing.total += Number(row.amount);
    } else {
      aggregated.set(key, {
        year,
        month,
        type: row.type,
        total: Number(row.amount),
      });
    }
  }

  return { data: Array.from(aggregated.values()), error: null };
}

/**
 * Get recent transactions for dashboard view.
 * Simple query without complex filters.
 */
export async function getRecentTransactions(
  limit: number = 15
): Promise<{ data: Transaction[]; error: Error | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .is("deleted_at", null)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  return {
    data: (data as Transaction[]) ?? [],
    error: error ? new Error(error.message) : null,
  };
}

/**
 * Get distinct years from transactions.
 */
export async function getAvailableYears(): Promise<number[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("transactions")
    .select("date")
    .is("deleted_at", null);

  const years = new Set<number>();

  // Always include current year and next year (for planning)
  const currentYear = new Date().getFullYear();
  years.add(currentYear);
  years.add(currentYear + 1);

  if (data) {
    data.forEach((row) => {
      const year = new Date(row.date).getFullYear();
      years.add(year);
    });
  }

  return Array.from(years).sort((a, b) => b - a);
}
