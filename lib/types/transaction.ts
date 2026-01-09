import type { TransactionTypeKey } from "@/lib/data/types";

/**
 * Transaction record from the database
 */
export interface Transaction {
  id: string;
  date: string;
  type: TransactionTypeKey;
  amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/**
 * Data for creating a new transaction
 */
export interface CreateTransactionData {
  date: string;
  type: TransactionTypeKey;
  amount: number;
  notes?: string | null;
}

/**
 * Data for updating an existing transaction
 */
export interface UpdateTransactionData {
  date?: string;
  type?: TransactionTypeKey;
  amount?: number;
  notes?: string | null;
}

/**
 * Filters for querying transactions
 */
export interface TransactionFilters {
  /** Start date (inclusive) */
  startDate?: string;
  /** End date (inclusive) */
  endDate?: string;
  /** Filter by specific types */
  types?: TransactionTypeKey[];
  /** Filter by category (expense or income) */
  category?: "expense" | "income";
  /** Search in notes */
  search?: string;
  /** Max results (default 50) */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Include soft-deleted records */
  includeDeleted?: boolean;
}

/**
 * Monthly aggregation for summary view
 */
export interface MonthlyTotal {
  year: number;
  month: number;
  type: TransactionTypeKey;
  total: number;
}

/**
 * Category breakdown for charts
 */
export interface CategoryBreakdown {
  type: TransactionTypeKey;
  total: number;
  count: number;
}
