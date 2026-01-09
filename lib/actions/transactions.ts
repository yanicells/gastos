"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  Transaction,
  CreateTransactionData,
  UpdateTransactionData,
} from "@/lib/types/transaction";

/**
 * Create a new transaction.
 */
export async function createTransaction(
  data: CreateTransactionData
): Promise<{ data: Transaction | null; error: string | null }> {
  const supabase = await createClient();

  const { data: result, error } = await supabase
    .from("transactions")
    .insert({
      date: data.date,
      type: data.type,
      amount: data.amount,
      notes: data.notes ?? null,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  revalidatePath("/");
  return { data: result as Transaction, error: null };
}

/**
 * Update an existing transaction.
 */
export async function updateTransaction(
  id: string,
  data: UpdateTransactionData
): Promise<{ data: Transaction | null; error: string | null }> {
  const supabase = await createClient();

  const { data: result, error } = await supabase
    .from("transactions")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  revalidatePath("/");
  return { data: result as Transaction, error: null };
}

/**
 * Soft delete a transaction (sets deleted_at timestamp).
 */
export async function softDeleteTransaction(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("transactions")
    .update({
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true, error: null };
}

/**
 * Soft delete multiple transactions.
 */
export async function softDeleteBatch(
  ids: string[]
): Promise<{ success: boolean; error: string | null; deletedCount: number }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transactions")
    .update({
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .in("id", ids)
    .is("deleted_at", null)
    .select("id");

  if (error) {
    return { success: false, error: error.message, deletedCount: 0 };
  }

  revalidatePath("/");
  return { success: true, error: null, deletedCount: data?.length ?? 0 };
}

/**
 * Restore a soft-deleted transaction.
 */
export async function restoreTransaction(
  id: string
): Promise<{ data: Transaction | null; error: string | null }> {
  const supabase = await createClient();

  const { data: result, error } = await supabase
    .from("transactions")
    .update({
      deleted_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .not("deleted_at", "is", null)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  revalidatePath("/");
  return { data: result as Transaction, error: null };
}
