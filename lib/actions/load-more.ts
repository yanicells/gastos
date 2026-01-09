"use server";

import { getTransactions } from "@/lib/queries/transactions";
import type { Transaction } from "@/lib/types/transaction";

/**
 * Server action to load more transactions for infinite scroll.
 */
export async function loadMoreTransactions(
  offset: number
): Promise<Transaction[]> {
  const { data } = await getTransactions({ offset, limit: 20 });
  return data;
}
