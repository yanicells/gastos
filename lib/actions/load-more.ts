"use server";

import { getTransactions } from "@/lib/queries/transactions";
import type { Transaction, TransactionFilters } from "@/lib/types/transaction";

/**
 * Server action to load more transactions for infinite scroll.
 * Now accepts filters for filtered pagination.
 */
export async function loadMoreTransactions(
  offset: number,
  filters?: TransactionFilters
): Promise<Transaction[]> {
  const { data } = await getTransactions({
    ...filters,
    offset,
    limit: 20,
  });
  return data;
}
